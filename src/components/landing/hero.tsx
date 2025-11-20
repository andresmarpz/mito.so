import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function LandingHero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 text-center pt-20 pb-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Now available in beta
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
          Your second brain, <br />
          <span className="text-muted-foreground">built for recall.</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Mito captures your thoughts, links, and memories, making them instantly retrievable with natural language. Never forget a detail again.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-foreground text-background font-medium transition-transform hover:scale-105 active:scale-95"
          >
            Start Remembering
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-border hover:bg-secondary/50 transition-colors"
          >
            How it works
          </Link>
        </div>
      </div>
    </section>
  );
}
