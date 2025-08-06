import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import {
  chats,
  chatMessages,
  type Chat,
  type ChatMessagePart,
} from "../db/schema";
import type { MyUIMessage } from "../types/ui-message";

export interface ChatMessage {
  id: string;
  role: "human" | "ai";
  chat_id: string;
  created_at: Date;
  updated_at: Date;
  parts: ChatMessagePart[];
}

export interface ChatWithMessages extends Chat {
  messages: MyUIMessage[];
}

export class ChatService {
  /**
   * Get a single chat with all its messages and message parts in a single query
   */
  static async getChatWithMessages(
    chatId: string
  ): Promise<ChatWithMessages | null> {
    const result = await db.query.chats.findFirst({
      where: eq(chats.chat_id, chatId),
      with: {
        messages: {
          orderBy: [chatMessages.created_at],
        },
      },
    });

    if (!result) return null;

    // Convert chat messages to UI messages
    const uiMessages: MyUIMessage[] = result.messages.map((message) => ({
      id: message.id,
      role: message.role === "human" ? "user" : "assistant",
      parts: message.parts,
      createdAt: message.created_at,
    }));

    return {
      ...result,
      messages: uiMessages,
    };
  }

  /**
   * Get user's chats with message count (no message content for performance)
   */
  static async getUserChats(
    userId: string
  ): Promise<(Chat & { messageCount: number })[]> {
    const userChats = await db.query.chats.findMany({
      where: eq(chats.user_id, userId),
      with: {
        messages: {
          columns: {
            id: true,
          },
        },
      },
      orderBy: [desc(chats.updated_at)],
    });

    return userChats.map((chat) => ({
      ...chat,
      messageCount: chat.messages.length,
      messages: undefined, // Remove messages from response
    }));
  }

  /**
   * Create a new chat
   */
  static async createChat(
    userId: string,
    title: string,
    chatId?: string
  ): Promise<Chat> {
    const [chat] = await db
      .insert(chats)
      .values({
        title,
        user_id: userId,
        chat_id: chatId,
      })
      .returning();

    if (!chat) {
      throw new Error("Failed to create chat.");
    }

    return chat;
  }

  /**
   * Add a message to a chat
   */
  static async addMessage(
    chatId: string,
    userId: string,
    role: "human" | "ai",
    parts: ChatMessagePart[]
  ): Promise<ChatMessage> {
    return await db.transaction(async (tx) => {
      await tx
        .insert(chats)
        .values({
          chat_id: chatId,
          title: "New Chat",
          user_id: userId,
        })
        .onConflictDoUpdate({
          target: [chats.chat_id],
          set: {
            updated_at: new Date(),
          },
        });

      // Insert the message with parts stored directly in jsonb
      const [message] = await tx
        .insert(chatMessages)
        .values({
          chat_id: chatId,
          role,
          parts,
        })
        .returning();

      if (!message) {
        throw new Error("Failed to create message.");
      }

      return {
        id: message.id,
        role: message.role,
        chat_id: message.chat_id,
        created_at: message.created_at,
        updated_at: message.updated_at,
        parts: message.parts,
      };
    });
  }
}
