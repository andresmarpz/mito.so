import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { Effect } from "effect";
import { effectRuntime } from "~/effect/live-runtime";
import { SigninSchema, SignupSchema } from "~/schemas/auth.schemas";
import { AuthService } from "~/services/auth.service";

/**
 * Promise land wrapper for the AuthService.
 */
export const authService = effectRuntime.runSync(
  Effect.gen(function* () {
    const authService = yield* AuthService;

    return {
      getSupabaseUser: (client: SupabaseAuthClient) =>
        Effect.runPromise(authService.getSupabaseUser(client)),
      getDatabaseUser: () => Effect.runPromise(authService.getDatabaseUser()),
      signIn: (signinValues: SigninSchema) =>
        Effect.runPromise(authService.signIn(signinValues)),
      signUp: (signupValues: SignupSchema) =>
        Effect.runPromise(authService.signUp(signupValues)),
    };
  })
);
