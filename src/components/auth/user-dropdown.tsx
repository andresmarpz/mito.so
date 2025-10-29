import Link from "next/link";
import SignOutMenuItem from "~/components/auth/sign-out.client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { authService } from "~/services/auth.service";

export default async function UserDropdown() {
  const user = await authService.getUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border p-2 max-w-[100px] truncate">
        <span>{user.email}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/account">Account</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <SignOutMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
