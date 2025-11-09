"use server";

import { cookies } from "next/headers";

export async function setAuthCookies(token: string, refreshToken: string) {
  const store = await cookies();
  store.set("token", token, { httpOnly: true, secure: true, sameSite: "strict", path: "/" });
  store.set("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict", path: "/" });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete("token");
  store.delete("refreshToken");
}

export async function getAuthToken() {
  const store = await cookies();
  return store.get("token")?.value || null;
}
