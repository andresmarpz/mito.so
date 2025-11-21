import { Layer, ManagedRuntime } from "effect";
import { AiServiceLive } from "~/services/ai.service";

export const effectRuntime = ManagedRuntime.make(
  Layer.empty.pipe(Layer.merge(AiServiceLive))
);
