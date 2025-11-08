import { redirect } from "next/navigation";
import { authService } from "~/services";
import { createClient } from "~/utils/supabase/server";

export default async function UserComponent() {
  const supabase = await createClient();
  const user = await authService.getSupabaseUser(supabase.auth);

  if (!user) {
    return redirect("/auth/signin");
  }

  return <div>Hello, {user.email}</div>;
}
