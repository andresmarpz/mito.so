import { AuthError, EmailOtpType, Session, User } from "@supabase/supabase-js";
import { Context, Effect, Layer } from "effect";
import z from "zod";
import {
  SupabaseError,
  VerifyEmailError,
} from "~/exceptions/supabase.exceptions";
import { createClient } from "~/utils/supabase/server";

export class SupabaseService extends Context.Tag("SupabaseService")<
  SupabaseService,
  {
    verifyEmail: (_: {
      token_hash: string;
      type: EmailOtpType;
      next: string;
    }) => Effect.Effect<
      { session: Session | null; user: User | null },
      SupabaseError | VerifyEmailError,
      never
    >;
  }
>() {}

const verifyEmailSchema = z.object({
  token_hash: z.string(),
  type: z.enum([
    "signup",
    "invite",
    "magiclink",
    "recovery",
    "email_change",
    "email",
  ]),
  next: z.string(),
});

export const SupabaseServiceLive = Layer.effect(
  SupabaseService,
  Effect.gen(function* () {
    return yield* Effect.succeed({
      verifyEmail: (values: {
        token_hash: string;
        type: EmailOtpType;
        next: string;
      }) =>
        Effect.gen(function* () {
          const parsedValues = yield* Effect.try({
            try: () => verifyEmailSchema.parse(values),
            catch: (error: unknown) => {
              if (error instanceof z.ZodError) {
                return new VerifyEmailError({
                  message: "Invalid verify email inputs.",
                  error_code: "INVALID_VERIFY_EMAIL_INPUTS",
                  status: 400,
                });
              }

              return new SupabaseError({
                cause: error,
              });
            },
          });

          const client = yield* Effect.promise(createClient);

          const data = yield* Effect.tryPromise({
            try: async () => {
              const { data, error } = await client.auth.verifyOtp({
                type: parsedValues.type,
                token_hash: parsedValues.token_hash,
              });

              if (error) {
                throw error;
              }

              return data;
            },
            catch: (error: unknown) => {
              console.log(JSON.stringify(error, null, 2));
              console.log(error);

              if (error instanceof AuthError) {
                switch (error.code) {
                  default:
                  case "bad_code_verifier":
                  case "otp_expired":
                    return new VerifyEmailError({
                      message: "The email verification code is invalid.",
                      error_code: "INVALID_VERIFY_EMAIL_CODE",
                      status: 400,
                    });
                }
              } else {
                return new SupabaseError({
                  cause: error,
                });
              }
            },
          });

          return yield* Effect.succeed(data);
        }),
    });
  })
);
