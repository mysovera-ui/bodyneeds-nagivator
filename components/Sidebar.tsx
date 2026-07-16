import { createClient } from "@/lib/supabase/server";
import SidebarNav from "@/components/SidebarNav";

export default async function Sidebar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <SidebarNav userEmail={user?.email ?? null} />;
}
