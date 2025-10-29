import { Data } from "effect";
import z from "zod";

export class GenericAuthError extends Data.TaggedError("GenericAuthError")<{
  message: string;
  code: string;
}> {}

export class CredentialsValidationError extends Data.TaggedError(
  "CredentialsValidationError"
)<{
  message: string;
  code: string;
  issues: z.core.$ZodIssue[];
}> {}

export class InvalidEmailSignupError extends Data.TaggedError(
  "InvalidEmailSignupError"
)<{
  message: string;
  code: string;
}> {}

export type AuthSignupError =
  | GenericAuthError
  | CredentialsValidationError
  | InvalidEmailSignupError;
