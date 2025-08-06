import { MemoizedMarkdown } from "~/components/chat/memoized-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { MyUIMessage } from "./chat-container";

export default function ChatMessage({ message }: { message: MyUIMessage }) {
  return (
    <Card
      className={cn("flex flex-col gap-2", {
        "bg-muted-foreground/20": message.role === "user",
      })}
    >
      <CardHeader>
        <CardTitle>{message.role}</CardTitle>
      </CardHeader>
      <CardContent>
        {message.parts.map((part, index) => {
          switch (part.type) {
            case "step-start":
              // show step boundaries as horizontal lines:
              return index > 0 ? (
                <div key={index} className="text-gray-500 my-2"></div>
              ) : null;
            case "text":
              return (
                <MemoizedMarkdown
                  key={`${message.id}-${part.text.slice(0, 10)}`}
                  id={message.id}
                  content={part.text}
                />
              );
            case "tool-get_current_weather":
              const toolName = part.type.split("-")[1];

              return (
                <Card key={`${part.toolCallId}`}>
                  <CardHeader>
                    <CardTitle>Tool: {toolName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      Input: <code>{JSON.stringify(part.input)}</code>
                    </div>
                    <div>
                      Output: <code>{JSON.stringify(part.output)}</code>
                    </div>
                  </CardContent>
                </Card>
              );
            default:
              return <pre>{JSON.stringify(part, null, 2)}</pre>;
          }
        })}
      </CardContent>
    </Card>
  );
}
