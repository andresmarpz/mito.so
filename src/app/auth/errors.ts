import { Data } from "effect";

export class InvalidCredentialsError extends Data.TaggedError(
  "InvalidCredentialsError"
)<{ message: string }> {
  _tag = "InvalidCredentialsError" as const;
}
