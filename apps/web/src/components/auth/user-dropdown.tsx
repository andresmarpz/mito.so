import { Match, Option } from "effect";
import { headers } from "next/headers";
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
import { auth } from "~/lib/auth/auth.server";

interface UserDropdownProps {
  enforceAuth?: boolean;
}

export default async function UserDropdown({
  enforceAuth = true,
}: UserDropdownProps) {
  const response = await auth.api.getSession({
    headers: await headers(),
  });

  return Option.match(Option.fromNullable(response), {
    onSome: (response) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border p-2 truncate">
            <span>{response.user.username ?? response.user.email}</span>
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
          // redirect("/auth/signin");
          return <div>Sign in</div>;
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
