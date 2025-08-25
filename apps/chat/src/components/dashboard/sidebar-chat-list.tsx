import Link from "next/link";
import { SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import { getQueryClient, trpc } from "~/query/server";

export function SidebarChatListLoading() {
  const SKELETON_COUNT = 8;

  return (
    <>
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <Skeleton className="h-8 w-full rounded-md" />
        </SidebarMenuItem>
      ))}
    </>
  );
}

export default async function SidebarChatList() {
  const client = getQueryClient();
  const chats = await client.fetchQuery(trpc.chat.get_all.queryOptions());

  return chats.map((chat) => (
    <SidebarMenuItem key={chat.chat_id}>
      <SidebarMenuButton asChild>
        <Link href={`/chat/${chat.chat_id}`}>
          <span>{chat.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));
}
