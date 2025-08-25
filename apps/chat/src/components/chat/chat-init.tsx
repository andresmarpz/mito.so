"use client";

import { Button } from "~/components/ui/button";

interface Props {
  onPromptClick: (prompt: string) => void;
}

const EXAMPLE_PROMPTS = [
  "how does AI work?",
  "how does GPU inference actually work?",
  "are black holes real?",
];

export default function ChatInit({ onPromptClick }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh mx-auto px-4 overflow-hidden flex-1 pb-40">
      <div className="text-center mb-8 w-full">
        <h2 className="text-base text-muted-foreground">how can I help you?</h2>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-md">
        {EXAMPLE_PROMPTS.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            className="text-left justify-start h-auto py-3 px-4 text-sm"
            onClick={() => onPromptClick(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
}
