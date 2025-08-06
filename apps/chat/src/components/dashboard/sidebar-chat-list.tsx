import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import { getQueryClient, trpc } from "~/query/server";

export default async function SidebarChatList() {
  const client = getQueryClient();
  const chats = await client.fetchQuery(trpc.chat.get_all.queryOptions());

  return chats.map((chat) => (
    <SidebarMenuItem key={chat.chat_id}>
      <SidebarMenuButton asChild>
        <Link href={`/chat/${chat.chat_id}`} className="border flex flex-col">
          <div className="flex items-center gap-2 w-full">
            <MessageCircle className="size-4 shrink-0" />
            <span className="font-medium truncate">{chat.title}</span>
          </div>
          <div className="text-xs text-muted-foreground pl-6 w-full">
            <p className="truncate">
              {chat.messageCount > 0 ? "No messages" : "No messages"}
            </p>
            <p className="text-xs mt-1">
              {chat.updated_at?.toString() ?? chat.created_at?.toString() ?? ""}
            </p>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));
}
