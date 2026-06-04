import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRun } from "@/lib/queries/leaderboard";

import AdminPanel from "@/components/admin/admin-panel";

export default async function AdminPage() {
  const cookiesStore = await cookies();
  const auth = cookiesStore.get("minecraft_auth");
  const run = await getRun();

  if (!process.env.ADMIN_AUTH_SECRET) {
    console.error("ADMIN_AUTH_SECRET not set");
    redirect("/admin/login");
  }

  if (auth?.value !== process.env.ADMIN_AUTH_SECRET) {
    redirect("/admin/login");
  }

  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center justify-center p-4">
      <AdminPanel run={run} />
    </main>
  );
}
