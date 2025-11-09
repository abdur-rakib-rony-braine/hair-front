import { getAuthToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const token = await getAuthToken();

  if (token) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  return null;
}
