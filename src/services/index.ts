import { Effect } from "effect";
import { effectRuntime } from "~/effect/live-runtime";
import { AiService } from "~/services/ai.service";

export const aiService = effectRuntime.runSync(
  Effect.gen(function* () {
    const aiService = yield* AiService;

    return {
      generateImage: (prompt: string) =>
        Effect.runPromiseExit(aiService.generateImage(prompt)),
    };
  })
);
