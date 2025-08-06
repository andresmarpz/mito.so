import type { InferUITools, UIDataTypes, UIMessage, UITools } from "ai";
import type { tools } from "../api/chat/router";

export type MyUIMessage = UIMessage<
  never,
  UIDataTypes,
  InferUITools<typeof tools>
>;
