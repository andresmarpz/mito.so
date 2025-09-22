import { redirect } from "next/navigation";
import { Suspense } from "react";

import { createClient } from "~/utils/supabase/server";

export default async function PrivatePage() {
  return (
    <>
      Hello!
      <Suspense fallback={<p>Loading...</p>}>
        <AuthUser />
      </Suspense>
    </>
  );
}

async function AuthUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return <p>Hello {data.user.email}</p>;
}
