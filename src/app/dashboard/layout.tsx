import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import { getAuthToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = await getAuthToken();

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Dashboard" />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}