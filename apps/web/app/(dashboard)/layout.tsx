import { Sidebar } from "@/features/dashboard/components/sidebar/sidebar";
import { Topbar } from "@/features/dashboard/components/topbar/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-[#0B1120] overflow-hidden text-slate-900 dark:text-white">
      {/* Desktop Sidebar (and Mobile Drawer) */}
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
