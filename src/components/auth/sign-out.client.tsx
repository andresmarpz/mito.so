"use client";

import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { createClient } from "~/utils/supabase/client";

export default function SignOutMenuItem() {
  const client = createClient();
  const router = useRouter();

  function signOut() {
    client.auth.signOut();
    router.refresh();
  }

  return <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>;
}
