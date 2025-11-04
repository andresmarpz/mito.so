import { Suspense } from "react";
import UserDropdown from "~/components/auth/user-dropdown";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="p-4 container mx-auto border-b flex justify-between items-center min-h-10">
        <span className="text-2xl font-bold">Mito.so</span>
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
