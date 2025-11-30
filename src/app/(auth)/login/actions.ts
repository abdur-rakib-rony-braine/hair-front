"use server";

import api from "@/lib/axios";
import { setAuthCookies } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const res = await api.post("/authentications/login", { email, password });

    await setAuthCookies(res.data.token, res.data.refreshToken);

    return { success: true };
  } catch (error: any) {
    console.error("Login error:", error?.response?.data || error);
    return { error: error?.response?.data?.message || "Login failed" };
  }
}