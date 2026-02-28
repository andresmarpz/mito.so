import { Navigate } from "react-router";
import { BookmarkIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";

export default function Dashboard() {
  const { data: session, isPending } = useSession();

  if (isPending) return null;
  if (!session) return <Navigate to="/home" replace />;

  return (
    <main className="flex-1 max-w-md m-auto px-6 py-12 sm:py-24">
      <div className="flex flex-col items-center text-center gap-5">
        <BookmarkIcon className="size-10 text-zinc-900" strokeWidth={1.5} />
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Welcome back
        </h1>
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-zinc-900">
            {session.user.name}
          </p>
          <p className="text-sm text-zinc-500">{session.user.email}</p>
        </div>
        <Button
          variant="outline"
          className="rounded-full px-5"
          onClick={() => signOut({ fetchOptions: { onSuccess: () => window.location.replace("/home") } })}
        >
          Sign out
        </Button>
      </div>
    </main>
  );
}
