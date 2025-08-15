"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ChatMessage from "~/components/chat/chat-message";
import ChatInput from "~/components/chat/chat-input";
import { createClient } from "~/lib/supabase/client";
import { v7 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/query/client";
import { inferRouterOutputs } from "@trpc/server";
import { appRouter } from "../../../../api/src/api/trpc/routers/_app";
import ChatInit from "~/components/chat/chat-init";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useEffect } from "react";
import { notFound } from "next/navigation";

interface Props {
  chatId?: string;
}

export type MyUIMessage = NonNullable<
  inferRouterOutputs<typeof appRouter>["chat"]["get"]
>["messages"][number];

export default function ChatContainer({ chatId }: Props) {
  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.chat.get.queryOptions(
      {
        chatId: chatId ?? null,
      },
      {
        enabled: !!chatId,
      }
    )
  );

  if (!!chatId && data === null) notFound();

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

  return (
    <div className="flex flex-col gap-4 mx-auto pt-4 text-sm max-w-3xl m-auto opacity-100 blur-[0px]">
      <div className="pb-44 flex flex-col gap-4 flex-1">
        {messages.length > 0 ? (
          messages.map((message) => {
            return <ChatMessage key={message.id} message={message} />;
          })
        ) : (
          <ChatInit onPromptClick={onSendMessage} />
        )}
      </div>

      <div className="max-w-3xl w-full mx-auto fixed bottom-4">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
