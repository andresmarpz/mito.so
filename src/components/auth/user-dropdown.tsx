import { Match, Option } from "effect";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignOutMenuItem from "~/components/auth/sign-out.client";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { authService, userService } from "~/services";
import { createClient } from "~/utils/supabase/server";

interface UserDropdownProps {
  enforceAuth?: boolean;
}

export default async function UserDropdown({
  enforceAuth = true,
}: UserDropdownProps) {
  const supabase = await createClient();
  const user = await authService.getSupabaseUser(supabase.auth);
  const dbUser = user ? await userService.getUserByEmail(user.email!) : null;

  return Option.match(Option.fromNullable(dbUser), {
    onSome: (user) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border p-2 truncate">
            <span>{user.username}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href="/account">Account</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <SignOutMenuItem />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    onNone: () =>
      Match.value(enforceAuth).pipe(
        Match.when(true, () => {
          redirect("/auth/signin");
        }),
        Match.when(false, () => (
          <div className="flex items-center gap-2">
            <Button variant="default" asChild>
              <Link href="/auth/signin">Sign in</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/signup">Sign up</Link>
            </Button>
          </div>
        )),
        Match.exhaustive
      ),
  });
}
