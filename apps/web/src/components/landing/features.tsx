import { Brain, Database, Lock, Zap } from "lucide-react";

const features = [
  {
    name: "Instant Capture",
    description: "Save links, notes, and thoughts in milliseconds. No friction, just capture.",
    icon: Zap,
  },
  {
    name: "Natural Recall",
    description: "Ask questions like you're talking to a friend. Mito finds the answer in your memories.",
    icon: Brain,
  },
  {
    name: "Private by Design",
    description: "Your memories are encrypted and stored locally when possible. You own your data.",
    icon: Lock,
  },
  {
    name: "Universal Storage",
    description: "Store text, images, code snippets, and more. Everything in one place.",
    icon: Database,
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to remember</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A complete system for your digital memory.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="group p-6 rounded-2xl bg-secondary/20 border border-border/50 hover:bg-secondary/40 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
