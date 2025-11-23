import { DitherBackground } from "~/components/ui/dither-background";
import { LandingHero } from "~/components/landing/hero";
import { LandingFeatures } from "~/components/landing/features";
import { LandingRetrieve } from "~/components/landing/retrieve";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden selection:bg-primary/20">
      <DitherBackground />

      <div className="relative z-10">
        <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
          <div className="text-xl font-bold tracking-tighter">mito</div>
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="/auth/signin"
              className="hover:text-foreground transition-colors"
            >
              Log in
            </a>
            <a
              href="/auth/signup"
              className="px-4 py-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              Sign up
            </a>
          </div>
        </nav>

        <LandingHero />
        <LandingFeatures />
        <LandingRetrieve />

        <footer className="py-12 text-center text-sm text-muted-foreground border-t border-border/40 mt-20">
          <p>© {new Date().getFullYear()} Mito. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
