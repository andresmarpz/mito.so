import { AppSidebar } from "~/components/dashboard/sidebar";
import SidebarControls from "~/components/dashboard/sidebar-controls";
import { SidebarProvider } from "~/components/ui/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="overscroll-none">
      <SidebarControls />
      <AppSidebar />

      <main className="flex-1 h-svh">{children}</main>
    </SidebarProvider>
  );
}
