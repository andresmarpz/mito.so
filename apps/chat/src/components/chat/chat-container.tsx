"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ChatInput from "~/components/chat/chat-input";
import { createClient } from "~/lib/supabase/client";
import { v7 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/query/client";
import { inferRouterOutputs } from "@trpc/server";
import { appRouter } from "../../../../api/src/api/trpc/routers/_app";
import ChatInit from "~/components/chat/chat-init";
import ChatLoading from "~/components/chat/chat-loading";
import ChatError from "~/components/chat/chat-error";
import ChatMessages from "~/components/chat/chat-messages";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import { ScrollArea } from "~/components/ui/scroll-area";
import { match, P } from "ts-pattern";

interface Props {
  chatId?: string;
}

export type MyUIMessage = NonNullable<
  inferRouterOutputs<typeof appRouter>["chat"]["get"]
>["messages"][number];

export default function ChatContainer({ chatId }: Props) {
  const trpc = useTRPC();

  const { data, isError, isFetched, isLoading, refetch } = useQuery(
    trpc.chat.get.queryOptions(
      {
        chatId: chatId ?? null,
      },
      {
        enabled: !!chatId,
      }
    )
  );

  if (!!chatId && isFetched && data === null) notFound();

  const { id, messages, setMessages, sendMessage } = useChat<MyUIMessage>({
    ...(chatId ? { id: chatId } : {}),
    generateId: v7,
    messages: data?.messages ?? [],
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/chat`,
      headers: async () => {
        const supabase = createClient();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("session", session);

        return {
          Authorization: `Bearer ${session?.access_token}`,
        };
      },
    }),
    onError(error) {
      console.error(error);
    },
  });

  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
    }
  }, [data, setMessages]);

  const onSendMessage = (message: string) => {
    const shouldRedirect =
      !!id && !window.location.pathname.startsWith("/chat/");
    if (shouldRedirect) {
      window.history.pushState(null, "", `/chat/${id}`);
    }

    sendMessage({
      parts: [{ type: "text", text: message }],
    });
  };

  const hasMessages = messages.length > 0;

  const renderChatContent = () => {
    return match({
      hasChatId: !!chatId,
      isLoading,
      isFetched,
      isError,
      hasMessages,
      data,
    })
      .with({ hasChatId: false, hasMessages: false }, () => (
        <ChatInit onPromptClick={onSendMessage} />
      ))
      .with({ hasChatId: false, hasMessages: true }, () => (
        <ChatMessages messages={messages} />
      ))
      .with({ hasChatId: true, isLoading: true }, () => (
        <ChatLoading message="Loading your conversation..." />
      ))
      .with({ hasChatId: true, isFetched: true, isError: true }, () => (
        <ChatError
          title="Failed to load chat"
          message="We couldn't load this conversation. Please check your connection and try again."
          onRetry={() => refetch()}
        />
      ))
      .with(
        { 
          hasChatId: true, 
          isFetched: true, 
          isError: false, 
          data: P.not(P.nullish) 
        },
        () => <ChatMessages messages={messages} />
      )
      .with(
        { 
          hasChatId: true, 
          isFetched: false, 
          isError: false, 
          isLoading: false 
        },
        () => <ChatLoading message="Initializing chat..." />
      )
      .otherwise(() => {
        console.error("Unhandled chat state:", {
          hasChatId: !!chatId,
          isLoading,
          isFetched,
          isError,
          hasMessages,
          data,
        });
        return (
          <ChatError
            title="Unexpected state"
            message="Something unexpected happened. Please refresh the page."
            onRetry={() => window.location.reload()}
          />
        );
      });
  };

  return (
    <div className="relative h-svh max-h-svh overflow-hidden">
      <ScrollArea className="h-full w-full">
        {renderChatContent()}
      </ScrollArea>
      <div className="absolute bottom-4 left-0 right-0 max-w-3xl mx-auto">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
