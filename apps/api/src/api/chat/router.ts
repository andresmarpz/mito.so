import type { Handler } from "hono";
import type { BlankEnv, BlankInput } from "hono/types";
import { openrouter } from "../../ai/openrouter";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  type ToolSet,
} from "ai";
import { db } from "../../db";
import { ChatService } from "../../services/chat";
import type { MyUIMessage } from "../../types/ui-message";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const tools: ToolSet = {
  get_current_weather: {
    description: "Get the current weather in a given location",
    inputSchema: z.object({
      location: z.string().describe("The location to get the weather for"),
    }),
    execute: async ({ location }) => {
      return `The weather in ${location} is sunny`;
    },
  },
};

export const chatPostHandler: Handler<BlankEnv, "/chat", BlankInput> = async (
  c
) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];
  const client = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data } = await client.auth.getUser(token);
  const user = data.user ?? null;

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { messages, id } = await c.req.json();

  // Save the latest user message to the database
  const latestMessage = messages[messages.length - 1];
  let saveUserMessage: Promise<any> | undefined;
  if (latestMessage && latestMessage.role === "user") {
    saveUserMessage = ChatService.addMessage(
      id,
      user.id,
      "human",
      latestMessage.parts
    ).catch((error) => {
      console.error("Error saving user message:", error);
    });
  }

  const result = streamText({
    model: openrouter.chat("openai/gpt-4o-mini"),
    messages: convertToModelMessages(messages),
    tools,
    stopWhen: [stepCountIs(25)],
  });

  result.consumeStream();

  return result.toUIMessageStreamResponse({
    onFinish: async ({ responseMessage }) => {
      await saveUserMessage;
      await ChatService.addMessage(id, user.id, "ai", responseMessage.parts);
    },
    onError: (error) => {
      console.error(error);
      return error instanceof Error ? error.message : String(error);
    },
    originalMessages: messages,
  });
};
