import { Console, Effect } from "effect";
import { redirect as nextRedirect } from "next/navigation";

export const redirect = (...params: Parameters<typeof nextRedirect>) =>
  Effect.gen(function* () {
    yield* Console.log("Redirecting to", params);

    nextRedirect(...params);
  });
