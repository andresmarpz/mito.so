import { FieldCardSkeleton } from "~/app/(dashboard)/account/fields/field-card-skeleton";

export default function SettingsFormSkeleton() {
  return (
    <div className="flex flex-col gap-4 my-4">
      <FieldCardSkeleton
        title="Username"
        description="Please enter a username you are comfortable with."
        footerText="Please use 32 characters at maximum."
      />
      <FieldCardSkeleton
        title="Display Name"
        description="Please enter your full name, or a display name you are comfortable with."
        footerText="Please use 32 characters at maximum."
      />
    </div>
  );
}
