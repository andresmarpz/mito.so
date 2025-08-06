"use client";

import { MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/query/client";
import Link from "next/link";

interface ChatListProps {
  activeChatId?: string;
}

export default function ChatList({ activeChatId }: ChatListProps) {
  const trpc = useTRPC();
  const { data: chats } = useQuery(trpc.chat.get_all.queryOptions());

  const formattedChats = chats?.map((chat) => ({
    id: chat.chat_id,
    title: chat.title,
    lastMessage: chat.messageCount > 0 ? "No messages" : "No messages",
    timestamp: chat.updated_at?.toString() ?? chat.created_at?.toString() ?? "",
    isActive: chat.chat_id === activeChatId,
  }));

  if (!formattedChats?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No conversations yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {formattedChats.map((chat) => (
        <Link key={chat.id} href={`/chat/${chat.id}`}>
          <div
            className={`flex flex-col gap-1 p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
              chat.isActive ? "bg-muted" : ""
            }`}
          >
            <div className="flex items-center gap-2 w-full">
              <MessageCircle className="size-4 shrink-0" />
              <span className="font-medium truncate">{chat.title}</span>
            </div>
            <div className="text-xs text-muted-foreground pl-6 w-full">
              <p className="truncate">{chat.lastMessage}</p>
              <p className="text-xs mt-1">{chat.timestamp}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
