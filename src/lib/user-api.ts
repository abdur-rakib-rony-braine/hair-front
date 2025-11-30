import api from "./axios";
import { User, UpdateProfileData } from "@/types/user";

export const userApi = {
  async getUserDetails(): Promise<User> {
    const response = await api.get("/users/details");
    return response.data;
  },

  async uploadUserImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/users/profile/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async updateUserProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.patch("/users/profile/", data);
    return response.data;
  },
};