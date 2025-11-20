"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export function LandingRetrieve() {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Simulate typing effect
  useEffect(() => {
    const text = "What was that article about cognitive load?";
    let i = 0;
    const timer = setTimeout(() => {
      setIsTyping(true);
      const interval = setInterval(() => {
        setQuery(text.slice(0, i + 1));
        i++;
        if (i === text.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 50);
      return () => clearInterval(interval);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-24 px-4 bg-secondary/5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold">Retrieve with AI</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Stop digging through folders and bookmarks. Just ask. Mito understands context and semantic meaning, finding exactly what you're looking for even if you don't remember the exact keywords.
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Semantic search across all your data
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Summarization of complex topics
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Connect ideas from different sources
            </li>
          </ul>
        </div>
        
        <div className="flex-1 w-full max-w-md">
          <div className="relative rounded-xl overflow-hidden border border-border shadow-2xl bg-background/50 backdrop-blur-xl">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              <div className="flex-1 text-center text-xs text-muted-foreground font-mono">mito_search.exe</div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  readOnly
                  className="w-full bg-secondary/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none"
                  placeholder="Ask anything..."
                />
                {isTyping && <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-primary animate-pulse" />}
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs font-bold">AI</span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Here's what I found about cognitive load:</p>
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                      <p className="font-medium text-foreground mb-1">Understanding Cognitive Load Theory</p>
                      <p className="text-xs line-clamp-2">Cognitive load refers to the amount of working memory resources used. There are three types: intrinsic, extraneous, and germane...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
