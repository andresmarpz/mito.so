import { Suspense } from "react";
import UserDropdown from "~/components/auth/user-dropdown";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="p-4 container mx-auto flex justify-between items-center min-h-10">
        <div className="text-xl font-bold tracking-tighter">mito</div>
        <div className="flex items-center min-h-10">
          <Suspense>
            <UserDropdown />
          </Suspense>
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </>
  );
}
