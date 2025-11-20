"use client";

import * as React from "react";
import { cn } from "~/lib/utils";

interface ModeToggleProps {
  mode: "memorize" | "recall";
  onModeChange: (mode: "memorize" | "recall") => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="relative inline-flex h-10 items-center rounded-full bg-secondary/50 p-1 ring-1 ring-border/50 backdrop-blur-sm">
      <div
        className={cn(
          "absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-background shadow-sm transition-all duration-300 ease-out",
          mode === "memorize" ? "left-1" : "left-[calc(50%+0px)]"
        )}
      />
      <button
        onClick={() => onModeChange("memorize")}
        className={cn(
          "relative z-10 flex h-full w-24 items-center justify-center rounded-full text-sm font-medium transition-colors duration-200",
          mode === "memorize" ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
        )}
      >
        Memorize
      </button>
      <button
        onClick={() => onModeChange("recall")}
        className={cn(
          "relative z-10 flex h-full w-24 items-center justify-center rounded-full text-sm font-medium transition-colors duration-200",
          mode === "recall" ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
        )}
      >
        Recall
      </button>
    </div>
  );
}
