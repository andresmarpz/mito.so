import { jsonb, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { authUsers } from "drizzle-orm/supabase";
import { lifecycleFields } from "./utils";
import type { MyUIMessage } from "../types/ui-message";
import { v7 as uuidv7 } from "uuid";

export interface ChatMetadata {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  [key: string]: any;
}

export const chatMessageRole = pgEnum("chat_message_role", ["human", "ai"]);

export const messagePartsType = pgEnum("message_parts_type", [
  "text",
  "reasoning",
  "tool",
  "source_url",
  "file",
]);

export const chats = pgTable("chats", {
  chat_id: uuid("chat_id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  user_id: uuid("user_id")
    .references(() => authUsers.id)
    .notNull(),
  title: text("title").notNull(),
  metadata: jsonb("metadata")
    .$type<ChatMetadata>()
    .$defaultFn(() => ({}))
    .notNull(),
  ...lifecycleFields,
});

export const chatMessages = pgTable("chat_messages", {
  chat_id: uuid("chat_id")
    .references(() => chats.chat_id)
    .notNull(),
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  role: chatMessageRole("role").notNull(),
  parts: jsonb("parts")
    .$type<ChatMessagePart[]>()
    .$defaultFn(() => [])
    .notNull(),
  ...lifecycleFields,
});

export const chatsRelations = relations(chats, ({ many }) => ({
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  chat: one(chats, {
    fields: [chatMessages.chat_id],
    references: [chats.chat_id],
  }),
}));

export type ChatMessagePart = MyUIMessage["parts"][number];
export type ChatMessagePartInsert = MyUIMessage["parts"][number];

export type Chat = typeof chats.$inferSelect;
export type ChatInsert = typeof chats.$inferInsert;
