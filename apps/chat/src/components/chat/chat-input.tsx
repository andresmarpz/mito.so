"use client";
import { CommandIcon, CornerDownLeftIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { useRef } from "react";

interface Props {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const form = useForm({
    defaultValues: {
      message: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!data.message.trim()) return;

    onSendMessage(data.message);
    form.reset();
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex h-full w-full">
        <div className="flex w-full">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    {...field}
                    ref={textareaRef}
                    className="resize-none h-[6lh] overflow-y-auto pr-20"
                    placeholder="Type your message..."
                    onKeyDown={handleKeyDown}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            className={cn(
              "text-xs font-semibold",
              "select-none",
              "gap-0.5 px-2!",
              "group",
              "absolute right-2 bottom-2",
              "disabled:opacity-50 rounded-xl",
              "z-10 cursor-default"
            )}
            type="submit"
            size="sm"
            variant="outline"
            disabled={!form.watch("message")?.trim()}
          >
            <CommandIcon className="h-4 w-4 group-hover:border-neutral-600 rounded p-[2px]" />
            <PlusIcon className="h-3! w-3! p-[2px]" />
            <CornerDownLeftIcon className="h-4 w-4 group-hover:border-neutral-600 rounded p-[2px]" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
