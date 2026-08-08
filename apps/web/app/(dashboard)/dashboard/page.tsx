import { DashboardGrid } from "@/features/dashboard/components/widgets/dashboard-grid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | MySafeVault",
  description: "Overview of your secure digital life.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardGrid />;
}
