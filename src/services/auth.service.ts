import { AuthError, Session, User } from "@supabase/supabase-js";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { Console, Context, Effect, Layer } from "effect";
import z from "zod";
import { UserSelect } from "~/db/schema";
import {
  AuthInvalidCredentialsError,
  AuthSigninError,
  AuthSignupError,
  CredentialsValidationError,
  GenericAuthError,
  InvalidEmailSignupError,
  OverEmailSendRateLimitError,
} from "~/exceptions/auth.exceptions";
import {
  signinSchema,
  SigninSchema,
  SignupSchema,
  signupSchema,
} from "~/schemas/auth.schemas";
import { UserService } from "~/services/user.service";
import { createClient } from "~/utils/supabase/server";

export class AuthService extends Context.Tag("AuthService")<
  AuthService,
  {
    signUp: (signupValues: SignupSchema) => Effect.Effect<
      {
        session: Session | null;
        user: User;
      },
      AuthSignupError,
      never
    >;
    signIn: (signinValues: SigninSchema) => Effect.Effect<
      {
        session: Session;
        user: User;
      },
      AuthSigninError,
      never
    >;
    getDatabaseUser: (
      userId: string
    ) => Effect.Effect<UserSelect | null, Error, never>;
    getSupabaseUser: (
      client: SupabaseAuthClient
    ) => Effect.Effect<User | null, Error, never>;
  }
>() {}

export const AuthServiceLive = Layer.effect(
  AuthService,
  Effect.gen(function* () {
    const userService = yield* UserService;

    return yield* Effect.succeed({
      getDatabaseUser: (userId: string) =>
        Effect.gen(function* () {
          return yield* userService.getUserById(userId);
        }),
      getSupabaseUser: (client: SupabaseAuthClient) =>
        Effect.gen(function* () {
          const user = yield* Effect.tryPromise({
            try: () =>
              client.getUser().then(({ data }) => {
                if (data.user) {
                  return data.user;
                } else {
                  throw new Error("User not found");
                }
              }),
            catch: (_err: unknown) => {
              return new Error("Failed to get user");
            },
          }).pipe(Effect.catchAll(() => Effect.succeed(null)));

          yield* Console.log(user);

          return yield* Effect.succeed(user);
        }),
      signIn: (signinValues: SigninSchema) =>
        Effect.gen(function* () {
          const credentials = yield* Effect.try({
            try: () => signinSchema.parse(signinValues),
            catch: (error: unknown) => {
              if (error instanceof z.ZodError) {
                return new CredentialsValidationError({
                  message: "Invalid email or password inputs.",
                  error_code: "INVALID_CREDENTIALS",
                  status: 400,
                  issues: error.issues,
                });
              }

              return new GenericAuthError({
                message: "An unknown error occurred validating the inputs.",
                error_code: "UNKNOWN_VALIDATION_ERROR",
                status: 500,
              });
            },
          });

          const supabase = yield* Effect.promise(createClient);

          const data = yield* Effect.tryPromise({
            try: async () => {
              const { data, error } = await supabase.auth.signInWithPassword(
                credentials
              );

              if (error && error instanceof AuthError) {
                throw error;
              } else {
                return data;
              }
            },
            catch: (error: unknown) => {
              if (error instanceof AuthError) {
                switch (error.code) {
                  case "invalid_credentials":
                  case "user_not_found":
                  case "email_address_invalid":
                    return new AuthInvalidCredentialsError({
                      message: "Invalid email or password.",
                      error_code: "INVALID_CREDENTIALS",
                      status: 400,
                    });
                  default:
                    return new GenericAuthError({
                      message: "An unknown error occurred during your signin.",
                      error_code: "UNKNOWN_SIGNIN_ERROR",
                      status: 500,
                    });
                }
              } else {
                return new GenericAuthError({
                  message: "An unknown error occurred during your signin.",
                  error_code: "UNKNOWN_SIGNIN_ERROR",
                  status: 500,
                });
              }
            },
          });

          if (!data.session || !data.user) {
            return yield* Effect.fail(
              new GenericAuthError({
                message: "An unknown error occurred during your signin.",
                error_code: "UNKNOWN_SIGNIN_ERROR",
                status: 500,
              })
            );
          }

          return yield* Effect.succeed(data);
        }),
      signUp: (signupValues: SignupSchema) =>
        Effect.gen(function* () {
          // Parse inputs to validate with the schema.
          const credentials = yield* Effect.try({
            try: () => signupSchema.parse(signupValues),
            catch: (error: unknown) => {
              if (error instanceof z.ZodError) {
                return new CredentialsValidationError({
                  message: "Invalid email or password inputs.",
                  error_code: "INVALID_CREDENTIALS",
                  status: 400,
                  issues: error.issues,
                });
              }

              return new GenericAuthError({
                message: "An unknown error occurred validating the inputs.",
                error_code: "UNKNOWN_VALIDATION_ERROR",
                status: 500,
              });
            },
          });

          const existingUser = yield* userService
            .getUserByEmail(credentials.email)
            .pipe(Effect.catchAll(() => Effect.succeed(null)));

          if (existingUser) {
            yield* Console.log(existingUser);
            return yield* Effect.fail(
              new InvalidEmailSignupError({
                message:
                  "Invalid email address. Please correct it or provide another.",
                error_code: "INVALID_EMAIL_ADDRESS",
                status: 400,
              })
            );
          }

          // Create a Supabase client.
          const supabase = yield* Effect.promise(createClient);

          // Sign up the user.
          const data = yield* Effect.tryPromise({
            try: async () => {
              const { data, error } = await supabase.auth.signUp(credentials);

              if (error && error instanceof AuthError) {
                throw error;
              } else {
                return data;
              }
            },
            catch: (error: unknown) => {
              if (error instanceof AuthError) {
                switch (error.code) {
                  case "conflict":
                  case "email_address_invalid":
                  case "email_address_not_authorized":
                  case "email_exists":
                    return new InvalidEmailSignupError({
                      message:
                        "Invalid email address. Please correct it or provide another.",
                      error_code: "INVALID_EMAIL_ADDRESS",
                      status: 400,
                    });

                  case "over_email_send_rate_limit":
                    return new OverEmailSendRateLimitError({
                      message: `You have tried to sign up too many times. Please try again in ${
                        error.message.split("after ")[1]
                      }.`,
                      error_code: "OVER_EMAIL_SEND_RATE_LIMIT",
                      status: 429,
                    });

                  default:
                    console.error(error);
                    return new GenericAuthError({
                      message:
                        "Some unexpected provider error happened during your signup. Please try again later.",
                      error_code: "UNKNOWN_SIGNUP_ERROR",
                      status: 500,
                    });
                }
              }

              return new GenericAuthError({
                message:
                  "Some unexpected internal error happened during your signup. Please try again later.",
                error_code: "UNKNOWN_SIGNUP_ERROR",
                status: 500,
              });
            },
          });

          if (data.user) {
            yield* userService.createUser({
              id: data.user.id,
              email: credentials.email,
              username: credentials.email.split("@")[0],
            });

            return yield* Effect.succeed(
              data as {
                session: Session | null;
                user: User;
              }
            );
          }

          return yield* Effect.fail(
            new GenericAuthError({
              message:
                "Some unexpected internal error happened during your signup. Please try again later.",
              error_code: "UNKNOWN_SIGNUP_ERROR",
              status: 500,
            })
          );
        }),
    });
  })
);
