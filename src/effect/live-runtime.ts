import { Layer, ManagedRuntime } from "effect";
import { AuthServiceLive } from "~/services/auth.service";
import { UserServiceLive } from "~/services/user.service";

export const effectRuntime = ManagedRuntime.make(
  Layer.merge(
    AuthServiceLive.pipe(Layer.provide(UserServiceLive)),
    UserServiceLive
  )
);
