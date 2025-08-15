import { AppSidebar } from "~/components/dashboard/sidebar";
import SidebarControls from "~/components/dashboard/sidebar-controls";
import { SidebarProvider } from "~/components/ui/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex-1 min-h-svh px-4">{children}</main>;
}
