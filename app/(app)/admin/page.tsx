import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const cookiesStore = await cookies();
  const auth = cookiesStore.get("minecraft_auth");

  if (auth?.value !== process.env.ADMIN_AUTH_SECRET) {
    redirect("/admin/login");
  }

  return <div>Admin Page</div>;
}
