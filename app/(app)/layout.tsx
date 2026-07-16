import Sidebar from "@/components/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="sm:pl-64 pt-14 sm:pt-0 min-h-screen">{children}</div>
    </>
  );
}
