import { Suspense } from "react";
import SettingsForm from "~/app/(dashboard)/account/settings-form";
import SettingsFormSkeleton from "~/app/(dashboard)/account/settings-form-skeleton";

export default async function AccountPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Account</h1>

      <Suspense fallback={<SettingsFormSkeleton />}>
        <SettingsForm />
      </Suspense>
    </div>
  );
}
