import DisplayNameField from "~/app/(dashboard)/account/fields/display-name";
import { redirect } from "next/navigation";
import UsernameField from "~/app/(dashboard)/account/fields/username-field";
import { headers } from "next/headers";
import { auth } from "~/lib/auth/auth.server";

export default async function SettingsForm() {
  const response = await auth.api.getSession({
    headers: await headers(),
  });

  if (!response) {
    return redirect("/auth/signin");
  }
  const { user } = response;

  return (
    <div className="flex flex-col gap-4 my-4">
      <UsernameField
        userId={user.id}
        currentUsername={user.username ?? undefined}
      />
      <DisplayNameField
        userId={user.id}
        currentDisplayName={user.name ?? undefined}
      />
    </div>
  );
}
