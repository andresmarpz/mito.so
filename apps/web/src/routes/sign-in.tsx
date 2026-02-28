import { useState } from "react";
import { Navigate, Link } from "react-router";
import { BookmarkIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "@/lib/auth-client";

export default function SignIn() {
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isPending) return null;
  if (session) return <Navigate to="/" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn.magicLink({
      email,
      callbackURL: "/",
    });

    setLoading(false);

    if (error) {
      setError(error.message ?? "Something went wrong");
    } else {
      setSent(true);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xs flex flex-col items-center gap-8">
        <Link to="/home" className="flex flex-col items-center gap-3">
          <BookmarkIcon className="size-8 text-zinc-900" strokeWidth={1.5} />
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            mito
          </h1>
        </Link>

        {sent ? (
          <div className="text-center flex flex-col gap-2">
            <p className="text-sm text-zinc-900 font-medium">Check your email</p>
            <p className="text-sm text-zinc-500">
              We sent a magic link to{" "}
              <span className="font-medium text-zinc-700">{email}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-ring/50 focus:ring-3 transition-all"
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full rounded-md" disabled={loading}>
              {loading ? "Sending..." : "Send magic link"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
