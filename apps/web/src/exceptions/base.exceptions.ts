import { Data } from "effect";

export type BaseHttpError = {
  status: number;
  message: string;
  error_code: string;
};

export const BaseHttpTaggedError = <
  T extends Record<string | number | symbol, unknown>
>(
  tag: string
) => Data.TaggedError(tag)<T & BaseHttpError>;

export const isBaseHttpError = (error: unknown): error is BaseHttpError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error &&
    "error_code" in error
  );
};
