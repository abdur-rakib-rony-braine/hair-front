"use server";

import api from "@/lib/axios";
import { setAuthCookies } from "@/lib/auth";

export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const language = formData.get("language") as string;

  try {
    const res = await api.post("/authentications/signup", {  email, password, language });

    await setAuthCookies(res.data.token, res.data.refreshToken);
    return { success: true };
  } catch (error: any) {
    console.error("Signup error:", error?.response?.data || error);
    return { error: error?.response?.data?.message || "Signup failed" };
  }
}