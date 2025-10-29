"use server";

import { Cause, Console, Effect, Exit } from "effect";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { InvalidCredentialsError } from "~/app/auth/errors";
import { effectRuntime } from "~/effect/live-runtime";
import { signinSchema, SigninSchema } from "~/schemas/auth.schemas";
import { AuthService } from "~/services/auth.service";

import { createClient } from "~/utils/supabase/server";

const signinEffect = (signinValues: SigninSchema) =>
  Effect.gen(function* () {
    yield* Console.log("Initializing login..");

    const credentials = yield* Effect.try({
      try: () => signinSchema.parse(signinValues),
      catch: () =>
        new InvalidCredentialsError({
          message: "Invalid email or password inputs.",
        }),
    });

    const supabase = yield* Effect.promise(createClient);

    const result = yield* Effect.tryPromise({
      try: () => supabase.auth.signInWithPassword(credentials),
      catch: () =>
        new InvalidCredentialsError({
          message: "Invalid email or password.",
        }),
    }).pipe();

    if (result.error) {
      // TODO: Check `result.error.code` and handle different errors accordingly.
      yield* Console.log("Error logging in", result.error);

      return yield* Effect.fail(
        new InvalidCredentialsError({
          message: "Invalid email or password.",
        })
      );
    } else {
      return yield* Effect.succeed(result.data.user);
    }
  });

export const signin = async (signinValues: SigninSchema) => {
  const exit = await Effect.runPromiseExit(signinEffect(signinValues));

  if (Exit.isSuccess(exit)) {
    revalidatePath("/", "layout");
    redirect("/");
  } else if (Exit.isFailure(exit)) {
    // If defect, wrap it in an error and throw it.
    // else, return the standardized error. For example, the InvalidCredentialsError.
    const cause = Cause.squash(exit.cause);
    console.log(cause);
    if (cause instanceof Error) {
      throw cause;
    }

    // if is Failure (not defect)
    return {
      success: false,
      error: Cause.squash(exit.cause),
      code: "INVALID_CREDENTIALS",
    };
  }
};
