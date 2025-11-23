import { Cause, Exit, Option } from "effect";
import { BaseHttpError, isBaseHttpError } from "~/exceptions/base.exceptions";

export const createServerAction = <ARGS extends unknown[], T, E>({
  handler,
  onSuccess,
  onError,
}: {
  handler: (...args: ARGS) => Promise<Exit.Exit<T, E>>;
  onSuccess?: (value: T) => void;
  onError?: (error: E) => void;
}) => {
  return async (...args: ARGS) => {
    const exit = await handler(...args);
    if (Exit.isSuccess(exit)) {
      onSuccess?.(exit.value);
      return exit.value;
    } else {
      // Check if the cause is a failure (expected error) or defect (unexpected error)
      const failureOption = Cause.failureOption(exit.cause);

      if (Option.isSome(failureOption)) {
        // It's a failure - call onError and handle the error
        const error = failureOption.value;
        onError?.(error as E);

        if (isBaseHttpError(error)) {
          return {
            status: error.status,
            message: error.message,
            error_code: error.error_code,
          } satisfies BaseHttpError;
        }
      }

      // For defects or unknown errors, return generic 500 error
      return {
        status: 500,
        message: "An unknown error occurred during the operation.",
        error_code: "UNKNOWN_ERROR",
      } satisfies BaseHttpError;
    }
  };
};
