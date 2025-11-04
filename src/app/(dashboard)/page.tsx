import { Suspense } from "react";
import UserComponent from "~/app/(dashboard)/_user-component";

export default async function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <UserComponent />
      </Suspense>
    </div>
  );
}
