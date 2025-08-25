"use client";

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  function handleNewChat() {
    router.push("/chat");
  }

  return (
    <Sidebar>
      <SidebarContent className="pt-10">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleNewChat}
                  >
                    <PlusIcon className="w-3 h-3" />
                    <span>New Chat</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{children}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
