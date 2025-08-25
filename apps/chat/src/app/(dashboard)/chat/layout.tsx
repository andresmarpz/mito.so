import { Suspense } from "react";
import { AppSidebar } from "~/components/dashboard/sidebar";
import SidebarChatList, {
  SidebarChatListLoading,
} from "~/components/dashboard/sidebar-chat-list";
import SidebarControls from "~/components/dashboard/sidebar-controls";
import { SidebarProvider } from "~/components/ui/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar>
        <Suspense fallback={<SidebarChatListLoading />}>
          <SidebarChatList />
        </Suspense>
      </AppSidebar>
      <SidebarControls />
      <main className="flex-1 min-h-svh">{children}</main>
    </SidebarProvider>
  );
}
