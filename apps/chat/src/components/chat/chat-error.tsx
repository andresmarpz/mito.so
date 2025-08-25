import { AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ChatError({
  title = "Something went wrong",
  message = "We couldn't load this chat. Please try again.",
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[50vh] gap-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <div className="text-center space-y-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}