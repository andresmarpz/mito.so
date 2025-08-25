import { Loader2 } from "lucide-react";

interface Props {
  message?: string;
}

export default function ChatLoading({ message = "Loading chat..." }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[50vh] gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}