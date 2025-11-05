import DisplayNameField from "~/app/(dashboard)/account/fields/display-name";
import { authService } from "~/services";
import { createClient } from "~/utils/supabase/server";
import { redirect } from "next/navigation";
import UsernameField from "~/app/(dashboard)/account/fields/username-field";

export default async function SettingsForm() {
  const supabase = await createClient();
  const supabaseUser = await authService.getSupabaseUser(supabase.auth);

  if (!supabaseUser) {
    return null;
  }

  const user = await authService.getDatabaseUser(supabaseUser.id);

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex flex-col gap-4 my-4">
      <UsernameField
        userId={user.id}
        currentUsername={user.username ?? undefined}
      />
      <DisplayNameField
        userId={user.id}
        currentDisplayName={user.firstName ?? undefined}
      />
    </div>
  );
}
