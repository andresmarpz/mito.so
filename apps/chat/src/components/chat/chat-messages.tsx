import { cn } from "~/lib/utils";
import ChatMessage from "~/components/chat/chat-message";
import type { MyUIMessage } from "./chat-container";

interface Props {
  messages: MyUIMessage[];
}

export default function ChatMessages({ messages }: Props) {
  return (
    <div
      className={cn(
        "max-w-3xl mx-auto",
        "pt-4 pb-40",
        "flex flex-col flex-1 gap-4"
      )}
    >
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
}