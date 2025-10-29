import { createLoader, parseAsString } from "nuqs/server";

export const coordinatesSearchParams = {
  email: parseAsString.withDefault(""),
  password: parseAsString.withDefault(""),
};
export const loadSearchParams = createLoader(coordinatesSearchParams);
