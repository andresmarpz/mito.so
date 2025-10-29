import { ManagedRuntime } from "effect";
import { AuthServiceLive } from "~/services/auth.service";

export const effectRuntime = ManagedRuntime.make(AuthServiceLive);
