import z from "zod";
import { BaseHttpTaggedError } from "~/exceptions/base.exceptions";

export class GenericAuthError extends BaseHttpTaggedError<{}>(
  "GenericAuthError"
) {}

export class CredentialsValidationError extends BaseHttpTaggedError<{
  issues: z.core.$ZodIssue[];
}>("CredentialsValidationError") {}

export class InvalidEmailSignupError extends BaseHttpTaggedError<{}>(
  "InvalidEmailSignupError"
) {}

export class OverEmailSendRateLimitError extends BaseHttpTaggedError<{}>(
  "OverEmailSendRateLimitError"
) {}

export class AuthInvalidCredentialsError extends BaseHttpTaggedError<{}>(
  "AuthInvalidCredentialsError"
) {}

export type AuthSignupError =
  | GenericAuthError
  | CredentialsValidationError
  | InvalidEmailSignupError
  | OverEmailSendRateLimitError
  | Error;

export type AuthSigninError =
  | GenericAuthError
  | CredentialsValidationError
  | InvalidEmailSignupError
  | OverEmailSendRateLimitError
  | Error;
