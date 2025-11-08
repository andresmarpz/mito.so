"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpIcon, PlusIcon } from "lucide-react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { generateImageAction } from "~/actions/ai/generate-image.action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Field } from "~/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "~/components/ui/input-group";
import { Separator } from "~/components/ui/separator";
import { useEventListener } from "~/hooks/use-keybind";

const formSchema = z.object({
  prompt: z.string().min(1).max(1000),
});

export default function PromptInput() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = form.handleSubmit(async (data) => {
    console.log(data);

    const imageUrl = await generateImageAction(data.prompt);

    console.log(imageUrl);

    form.reset({
      prompt: "",
    });
  });

  useEventListener("keypress", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      formRef.current?.requestSubmit();
    }
  });

  return (
    <form onSubmit={onSubmit} ref={formRef}>
      <Controller
        control={form.control}
        name="prompt"
        render={({ field, fieldState }) => {
          return (
            <Field data-invalid={fieldState.invalid}>
              <InputGroup>
                <InputGroupTextarea
                  placeholder="A dog happily running down a cliff..."
                  rows={6}
                  className="min-h-24 max-h-[5lh] resize-none"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupButton
                    variant="outline"
                    className="rounded-full"
                    size="icon-xs"
                  >
                    <PlusIcon />
                  </InputGroupButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <InputGroupButton variant="ghost">Auto</InputGroupButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="top"
                      align="start"
                      className="[--radius:0.95rem]"
                    >
                      <DropdownMenuItem>Auto</DropdownMenuItem>
                      <DropdownMenuItem>Agent</DropdownMenuItem>
                      <DropdownMenuItem>Manual</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <InputGroupText className="ml-auto">52% used</InputGroupText>
                  <Separator orientation="vertical" className="!h-4" />
                  <InputGroupButton
                    variant="default"
                    className="rounded-full"
                    size="icon-xs"
                    disabled
                  >
                    <ArrowUpIcon />
                    <span className="sr-only">Send</span>
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          );
        }}
      />
    </form>
  );
}
