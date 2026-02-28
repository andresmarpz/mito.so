import { SignOutIcon } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth-client";

export function UserDropdown() {
  const { data: session } = useSession();

  if (!session) return null;

  const { user } = session;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar>
          {user.image && <AvatarImage src={user.image} alt={user.name} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col">
              {user.name && (
                <span className="text-sm font-medium text-foreground truncate">{user.name}</span>
              )}
              <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            signOut({
              fetchOptions: {
                onSuccess: () => window.location.replace("/home"),
              },
            })
          }
        >
          <SignOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
