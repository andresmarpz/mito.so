import { Layer, ManagedRuntime } from "effect";
import { AiServiceLive } from "~/services/ai.service";
import { AuthServiceLive } from "~/services/auth.service";
import { SupabaseServiceLive } from "~/services/supabase.service";
import { UserServiceLive } from "~/services/user.service";

export const effectRuntime = ManagedRuntime.make(
  Layer.empty.pipe(
    Layer.merge(AuthServiceLive.pipe(Layer.provide(UserServiceLive))),
    Layer.merge(UserServiceLive),
    Layer.merge(SupabaseServiceLive),
    Layer.merge(AiServiceLive)
  )
);
