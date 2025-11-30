"use client";
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { userApi } from "@/lib/user-api";
import { useRouter } from "next/navigation";

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            setLoading(true);
            setError(null);
            const userData = await userApi.getUserDetails();
            setUser(userData);
        } catch (err: any) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch user data";
            setError(errorMessage);
            console.error("Error fetching user:", err);

            if (err.response?.status === 401) {
                router.push("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (data: Partial<User["profile"]>) => {
        try {
            const updatedUser = await userApi.updateUserProfile(data);
            setUser(updatedUser);
            return updatedUser;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update user profile";
            setError(errorMessage);
            throw err;
        }
    };

    const uploadAvatar = async (file: File) => {
        try {
            const result = await userApi.uploadUserImage(file);
            await fetchUser();
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to upload image";
            setError(errorMessage);
            throw err;
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return {
        user,
        loading,
        error,
        refetch: fetchUser,
        updateUser,
        uploadAvatar,
        clearError: () => setError(null),
    };
}