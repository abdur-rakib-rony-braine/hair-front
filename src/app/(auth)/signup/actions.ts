"use server";

import api from "@/lib/axios";
import { setAuthCookies } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signupAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const res = await api.post("/authentications/signup", { name, email, password });

    await setAuthCookies(res.data.token, res.data.refreshToken);
    redirect("/dashboard");
  } catch (error: any) {
    return { error: error?.response?.data?.message || "Signup failed" };
  }
}
