import { Navigate, Outlet } from "react-router";
import { UserDropdown } from "@/components/user-dropdown";
import { useSession } from "@/lib/auth-client";

export default function DashboardLayout() {
  const { data: session, isPending } = useSession();

  if (isPending) return null;
  if (!session) return <Navigate to="/home" replace />;

  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight">mito</span>
          </div>
          <UserDropdown />
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
