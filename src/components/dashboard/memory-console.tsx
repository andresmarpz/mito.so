"use client";

import * as React from "react";
import { ModeToggle } from "./mode-toggle";
import { cn } from "~/lib/utils";
import { ArrowUp, Search } from "lucide-react";

export function MemoryConsole() {
  const [mode, setMode] = React.useState<"memorize" | "recall">("memorize");
  const [input, setInput] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement submission logic
    console.log(`Submitting in ${mode} mode:`, input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ModeToggle mode={mode} onModeChange={setMode} />

      <div className="w-full relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
        
        <form 
          onSubmit={handleSubmit}
          className="relative flex flex-col w-full bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 focus-within:ring-1 focus-within:ring-primary/20 focus-within:border-primary/20"
        >
          <div className="relative flex items-start p-4">
            {mode === "recall" && (
              <Search className="w-5 h-5 text-muted-foreground mt-1 mr-3 shrink-0" />
            )}
            
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === "memorize" 
                  ? "What would you like to remember?" 
                  : "Ask me anything about your memories..."
              }
              className={cn(
                "flex-1 bg-transparent border-0 resize-none focus:ring-0 p-0 text-lg placeholder:text-muted-foreground/50 min-h-[60px] max-h-[300px]",
                mode === "recall" ? "mt-0.5" : ""
              )}
              rows={1}
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className={cn(
                "ml-2 p-2 rounded-xl transition-all duration-200 shrink-0",
                input.trim() 
                  ? "bg-foreground text-background hover:bg-foreground/90 shadow-sm" 
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              )}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
          
          <div className="px-4 py-2 bg-muted/30 border-t border-border/30 flex justify-between items-center text-xs text-muted-foreground">
            <span>{mode === "memorize" ? "Enter to save" : "Enter to search"}</span>
            <span className="opacity-50">Markdown supported</span>
          </div>
        </form>
      </div>
    </div>
  );
}
