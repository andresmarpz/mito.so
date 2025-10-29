"use server";

import { Cause, Console, Effect, Exit } from "effect";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { effectRuntime } from "~/effect/live-runtime";
import { BaseHttpError, isBaseHttpError } from "~/exceptions/base.exceptions";
import { SignupSchema } from "~/schemas/auth.schemas";
import { AuthService } from "~/services/auth.service";

export const signupAction = async (
  signupValues: SignupSchema
): Promise<BaseHttpError | undefined> => {
  const exit = await effectRuntime.runPromiseExit(
    Effect.gen(function* () {
      const authService = yield* AuthService;

      return yield* authService.signUp(signupValues);
    }).pipe(Effect.tapError((error) => Console.log(error)))
  );

  if (Exit.isSuccess(exit)) {
    revalidatePath("/", "layout");
    redirect("/");
  } else if (Exit.isFailure(exit)) {
    const cause = Cause.squash(exit.cause);

    if (isBaseHttpError(cause)) {
      return {
        status: cause.status,
        message: cause.message,
        error_code: cause.error_code,
      } satisfies BaseHttpError;
    } else {
      console.error(cause);
      return {
        status: 500,
        message: "An unknown error occurred during signup.",
        error_code: "UNKNOWN_ERROR",
      } satisfies BaseHttpError;
    }
  }
};
