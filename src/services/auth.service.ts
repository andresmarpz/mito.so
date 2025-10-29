import { AuthError, Session, User } from "@supabase/supabase-js";
import { Console, Context, Effect, Layer } from "effect";
import { redirect } from "next/navigation";
import { cache } from "react";
import z from "zod";
import {
  AuthSignupError,
  CredentialsValidationError,
  GenericAuthError,
  InvalidEmailSignupError,
} from "~/exceptions/auth.exceptions";
import { signupSchema } from "~/schemas/auth.schemas";
import { createClient } from "~/utils/supabase/server";

const getUser = cache(async function getUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return data.user;
});

async function EnforceAuth() {
  await getUser();
  return null;
}

export const authService = Object.freeze({
  getUser,
  EnforceAuth,
});

export class AuthService extends Context.Tag("AuthService")<
  AuthService,
  {
    signUp: (formData: FormData) => Effect.Effect<
      {
        session: Session;
        user: User;
      },
      AuthSignupError,
      never
    >;
  }
>() {}

export const AuthServiceLive = Layer.effect(
  AuthService,
  Effect.gen(function* () {
    return yield* Effect.succeed({
      signUp: (formData: FormData) =>
        Effect.gen(function* () {
          // Parse inputs to validate with the schema.
          const credentials = yield* Effect.try({
            try: () => signupSchema.parse(Object.fromEntries(formData)),
            catch: (error: unknown) => {
              if (error instanceof z.ZodError) {
                return new CredentialsValidationError({
                  message: "Invalid email or password inputs.",
                  code: "INVALID_CREDENTIALS",
                  issues: error.issues,
                });
              }

              return new GenericAuthError({
                message: "An unknown error occurred validating the inputs.",
                code: "invalid_credentials",
              });
            },
          });

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
                      code: "email_address_invalid",
                    });
                  default:
                    console.error(error);
                    return new GenericAuthError({
                      message:
                        "Some unexpected provider error happened during your signup. Please try again later.",
                      code: "internal_signup_error",
                    });
                }
              }

              return new GenericAuthError({
                message:
                  "Some unexpected internal error happened during your signup. Please try again later.",
                code: "internal_signup_error",
              });
            },
          });

          yield* Console.log(data);

          if (!data.user || !data.session) {
            return yield* Effect.fail(
              new GenericAuthError({
                message:
                  "Some unexpected internal error happened while retrieving your new user. Check your email or try to log in.",
                code: "signup_success_retrieve_failure",
              })
            );
          }

          return yield* Effect.succeed(
            data as {
              session: Session;
              user: User;
            }
          );
        }),
    });
  })
);
