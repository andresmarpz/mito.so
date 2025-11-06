import { EmailOtpType } from "@supabase/supabase-js";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { Effect } from "effect";
import { UserInsert } from "~/db/schema";
import { effectRuntime } from "~/effect/live-runtime";
import { SigninSchema, SignupSchema } from "~/schemas/auth.schemas";
import { AuthService } from "~/services/auth.service";
import { SupabaseService } from "~/services/supabase.service";
import { UserService } from "~/services/user.service";

/**
 * Promise land wrapper for the AuthService.
 */
export const authService = effectRuntime.runSync(
  Effect.gen(function* () {
    const authService = yield* AuthService;

    return {
      getSupabaseUser: (client: SupabaseAuthClient) =>
        Effect.runPromise(authService.getSupabaseUser(client)),
      getDatabaseUser: (userId: string) =>
        Effect.runPromise(authService.getDatabaseUser(userId)),
      signIn: (signinValues: SigninSchema) =>
        Effect.runPromiseExit(authService.signIn(signinValues)),
      signUp: (signupValues: SignupSchema) =>
        Effect.runPromise(authService.signUp(signupValues)),
    };
  })
);

export const userService = effectRuntime.runSync(
  Effect.gen(function* () {
    const userService = yield* UserService;

    return {
      updateUser: (user: Partial<UserInsert>) =>
        Effect.runPromiseExit(userService.updateUser(user)),
      getUserByEmail: (email: string) =>
        Effect.runPromise(userService.getUserByEmail(email)),
      createUser: (user: UserInsert) =>
        Effect.runPromise(userService.createUser(user)),
    };
  })
);

export const supabaseService = effectRuntime.runSync(
  Effect.gen(function* () {
    const supabaseService = yield* SupabaseService;

    return {
      verifyEmail: (values: {
        token_hash: string;
        type: EmailOtpType;
        next: string;
      }) => Effect.runPromiseExit(supabaseService.verifyEmail(values)),
    };
  })
);
