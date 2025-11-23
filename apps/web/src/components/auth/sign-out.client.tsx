"use client";

import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { authClient } from "~/lib/auth/auth.client";

export default function SignOutMenuItem() {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.refresh();
  }

  return <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>;
}
