import { Layer, ManagedRuntime } from "effect";
import { AuthServiceLive } from "~/services/auth.service";
import { UserServiceLive } from "~/services/user.service";

export const effectRuntime = ManagedRuntime.make(
  AuthServiceLive.pipe(Layer.provide(UserServiceLive))
);
