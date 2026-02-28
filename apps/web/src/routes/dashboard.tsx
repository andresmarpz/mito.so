import {
  ArrowSquareOut,
  CircleNotch,
  Copy,
  DotsThree,
  Globe,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useSession } from "@/lib/auth-client";

interface Bookmark {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  siteName: string | null;
  faviconUrl: string | null;
  imageUrl: string | null;
  type: string;
  metadataStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface BookmarkForm {
  url: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

async function deleteBookmark(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/bookmarks/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to delete bookmark");
  }
}

async function createBookmark(url: string): Promise<Bookmark> {
  const res = await fetch(`${API_URL}/api/bookmarks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    throw new Error("Failed to create bookmark");
  }
  return res.json();
}

function BookmarkRow({ bookmark: b }: { bookmark: Bookmark }) {
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBookmark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const isDeleting = deleteMutation.isPending;

  return (
    <li className="group/row relative grid grid-cols-[2.5rem_1fr_auto] items-center rounded-lg hover:bg-zinc-100 has-data-[popup-open]:bg-zinc-100 transition-colors">
      <a
        href={b.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        className="absolute inset-0 z-0"
        aria-label={b.title ?? b.url}
      />

      <div className="pointer-events-none select-none py-2.5 pl-3">
        {b.faviconUrl ? (
          <img src={b.faviconUrl} alt="" className="size-5 rounded" />
        ) : (
          <Globe className="size-5 text-zinc-400" />
        )}
      </div>

      <div className="pointer-events-none select-none py-2.5 pr-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium text-zinc-800">
            {b.title ?? b.url}
          </span>
          <span className="hidden shrink-0 text-xs text-zinc-400 sm:inline">
            {getDomain(b.url)}
          </span>
        </div>
      </div>

      <div className="relative z-10 py-2.5 pr-3">
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover/row:opacity-100 group-has-data-[popup-open]/row:opacity-100">
          <DropdownMenu
            open={menuOpen}
            onOpenChange={(open) => {
              if (!isDeleting) setMenuOpen(open);
            }}
          >
            <DropdownMenuTrigger className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200 transition-colors">
              <DotsThree weight="bold" className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={4}
              className="min-w-48"
            >
              <DropdownMenuItem
                onClick={() => window.open(b.url, "_blank")}
              >
                <ArrowSquareOut className="size-4" />
                Open in new tab
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(b.url)}
              >
                <Copy className="size-4" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                closeOnClick={false}
                disabled={isDeleting}
                onClick={() => deleteMutation.mutate(b.id)}
              >
                {isDeleting ? (
                  <CircleNotch className="size-4 animate-spin" />
                ) : (
                  <Trash className="size-4" />
                )}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </li>
  );
}

export default function Dashboard() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookmarkForm>();

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: bookmarks = [] } = useQuery<Bookmark[]>({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/bookmarks`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch bookmarks");
      return res.json();
    },
    enabled: !!session,
  });

  const mutation = useMutation({
    mutationFn: (url: string) => createBookmark(url),
    onMutate: async (url) => {
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });

      const previous = queryClient.getQueryData<Bookmark[]>(["bookmarks"]);

      const optimistic: Bookmark = {
        id: crypto.randomUUID(),
        url,
        title: null,
        description: null,
        siteName: null,
        faviconUrl: null,
        imageUrl: null,
        type: "website",
        metadataStatus: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Bookmark[]>(["bookmarks"], (old = []) => [
        optimistic,
        ...old,
      ]);

      return { previous };
    },
    onError: (_err, _url, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["bookmarks"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey && e.key === "f") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!session) return null;

  function normalizeUrl(raw: string): string {
    const trimmed = raw.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  function onSubmit(data: BookmarkForm) {
    const url = normalizeUrl(data.url);
    mutation.mutate(url);
    reset();
  }

  const { ref, ...urlField } = register("url", {
    required: "Please enter a URL.",
    validate(value) {
      try {
        const url = new URL(normalizeUrl(value));
        if (!url.hostname.includes(".")) return "Enter a valid URL.";
        return true;
      } catch {
        return "Enter a valid URL.";
      }
    },
  });

  return (
    <div className="mx-auto max-w-lg px-6 py-12 sm:py-24">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field data-invalid={!!errors.url}>
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-sm focus-within:border-zinc-300 focus-within:ring-2 focus-within:ring-zinc-100">
            <Plus className="size-4 shrink-0 text-zinc-400" />
            <Input
              ref={(el) => {
                ref(el);
                inputRef.current = el;
              }}
              placeholder="Insert a link, color, or just plain text..."
              className="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:border-0"
              {...urlField}
            />
            <KbdGroup className="hidden sm:inline-flex">
              <Kbd>&#8984;</Kbd>
              <Kbd>F</Kbd>
            </KbdGroup>
          </div>
          <FieldError errors={[errors.url]} />
        </Field>
      </form>

      {bookmarks.length > 0 && (
        <ul className="mt-8 space-y-0.5">
          {bookmarks.map((b) => (
            <BookmarkRow key={b.id} bookmark={b} />
          ))}
        </ul>
      )}
    </div>
  );
}
