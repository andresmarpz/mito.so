import ChatContainer from "~/components/chat/chat-container";
import { HydrateClient } from "~/query/server";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  return (
    <HydrateClient>
      <ChatContainer chatId={chatId} />
    </HydrateClient>
  );
}
