import { Console, Context, Effect, Layer } from "effect";
import { generateText, ImagePart } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import fs from "fs";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export class AiService extends Context.Tag("AiService")<
  AiService,
  {
    generateImage: (prompt: string) => Effect.Effect<string, unknown, never>;
  }
>() {}

export const AiServiceLive = Layer.effect(
  AiService,
  Effect.gen(function* () {
    return yield* Effect.succeed({
      generateImage: (prompt: string) =>
        Effect.gen(function* () {
          const input = "output/generated-1762560459240.png";

          const generation = yield* Effect.promise(() =>
            generateText({
              model: google("gemini-2.5-flash-image"),
              messages: [
                {
                  role: "user",
                  content: `edit this image, add some birds to it as well`,
                },
                {
                  role: "user",
                  content: [
                    {
                      type: "image",
                      image: fs.readFileSync(input),
                    } satisfies ImagePart,
                  ],
                },
              ],
            })
          );

          for (const file of generation.files) {
            if (file.mediaType.startsWith("image/")) {
              const timestamp = Date.now();
              const fileName = `generated-${timestamp}.png`;

              yield* Effect.promise(async () => {
                await fs.promises.mkdir("output", { recursive: true });
                await fs.promises.writeFile(
                  `output/${fileName}`,
                  file.uint8Array
                );
                console.log(`Generated and saved image: output/${fileName}`);
              });
            }
          }

          return yield* Effect.succeed(prompt);
        }),
    });
  })
);
