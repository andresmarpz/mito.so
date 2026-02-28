import {
  BookmarkIcon,
  FileSearchIcon,
  FolderOpenIcon,
  GlobeIcon,
  KeyboardIcon,
  LayoutIcon,
  LightningIcon,
  LockIcon,
  MonitorIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: LightningIcon,
    title: "Save in seconds",
    description: "Paste any URL, hit enter. Done. No friction, no extra steps.",
  },
  {
    icon: GlobeIcon,
    title: "Auto-fetch metadata",
    description:
      "Titles, descriptions, and favicons are pulled automatically so you don't have to.",
  },
  {
    icon: FolderOpenIcon,
    title: "Organize with groups",
    description: "Create collections to categorize your bookmarks however you want.",
  },
  {
    icon: FileSearchIcon,
    title: "Instant search",
    description: "Find any bookmark by title, URL, or group in milliseconds.",
  },
  {
    icon: KeyboardIcon,
    title: "Keyboard shortcuts",
    description: "Navigate, search, and manage everything without touching your mouse.",
  },
  {
    icon: LockIcon,
    title: "Private by default",
    description: "Your bookmarks are yours alone. No ads, no tracking, no data selling.",
  },
  {
    icon: LayoutIcon,
    title: "Minimal interface",
    description: "No clutter, no distractions. Just your bookmarks, clean and simple.",
  },
  {
    icon: MonitorIcon,
    title: "Access anywhere",
    description: "Web-based means no apps to install. Works on any device with a browser.",
  },
];

export default function Home() {
  return (
    <>
      <main className="flex-1 max-w-md m-auto px-6 py-12 sm:py-24">
        {/* Hero */}
        <div className="flex flex-col items-center text-center gap-5">
          <BookmarkIcon className="size-10 text-zinc-900" strokeWidth={1.5} />
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900">mito</h1>
          <p className="text-zinc-500 text-base">simple, fast, and minimal bookmark manager.</p>
          <div className="flex items-center gap-2 pt-1">
            <Button
              className="rounded-full px-5"
              nativeButton={false}
              render={<Link to="/sign-in" />}
            >
              Sign up
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-5"
              nativeButton={false}
              render={<Link to="/sign-in" />}
            >
              Log in
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-5 sm:gap-7 pt-16 sm:pt-24">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4">
              <feature.icon className="size-5 text-zinc-700 shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <h2 className="font-medium text-zinc-900 text-sm sm:text-base">{feature.title}</h2>
                <p className="text-zinc-500 text-sm mt-0.5">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md m-auto px-6 pb-10 pt-8 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-4 text-xs text-zinc-400">
          {/* biome-ignore lint/a11y/useValidAnchor: placeholder link */}
          <a href="#" className="hover:text-zinc-600 transition-colors">
            Terms
          </a>
          {/* biome-ignore lint/a11y/useValidAnchor: placeholder link */}
          <a href="#" className="hover:text-zinc-600 transition-colors">
            Privacy
          </a>
          {/* biome-ignore lint/a11y/useValidAnchor: placeholder link */}
          <a href="#" className="hover:text-zinc-600 transition-colors">
            Changelog
          </a>
        </div>
        <p className="text-xs text-zinc-400">
          &copy; 2026 mito — Save and organize your bookmarks beautifully.
        </p>
      </footer>
    </>
  );
}
