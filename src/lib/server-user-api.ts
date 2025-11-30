import { User } from "@/types/user";
import { getAuthToken } from "@/lib/auth";

export const serverUserApi = {
  async getUserDetails(): Promise<User> {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/details`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication failed");
      }
      throw new Error(`Failed to fetch user details: ${response.statusText}`);
    }

    return response.json();
  }
};