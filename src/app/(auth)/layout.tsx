import { getAuthToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const token = await getAuthToken();

  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/30">
      {children}
    </div>
  );
}