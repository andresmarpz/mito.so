import { Schema } from "effect";

export class SupabaseError extends Schema.TaggedError<SupabaseError>(
  "SupabaseError"
)("SupabaseError", {
  cause: Schema.Defect.pipe(Schema.optional),
}) {}

export class VerifyEmailError extends Schema.TaggedError<VerifyEmailError>(
  "VerifyEmailError"
)("VerifyEmailError", {
  cause: Schema.Defect.pipe(Schema.optional),
  message: Schema.String,
  error_code: Schema.String,
  status: Schema.Number,
}) {}
