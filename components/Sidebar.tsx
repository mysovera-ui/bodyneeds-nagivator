import { cookies } from "next/headers";
import SidebarNav from "@/components/SidebarNav";

export default async function Sidebar() {
  const cookieStore = await cookies();
  const expected = process.env.ADMIN_PASSWORD;
  const session = cookieStore.get("admin_session")?.value;
  const isAdmin = Boolean(expected && session === expected);

  return <SidebarNav isAdmin={isAdmin} />;
}
