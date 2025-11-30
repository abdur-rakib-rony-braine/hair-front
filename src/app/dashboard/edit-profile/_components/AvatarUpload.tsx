"use client";
import { useState } from "react";
import { User } from "@/types/user";
import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

interface AvatarUploadProps {
    user: User;
}

const AvatarUpload = ({ user }: AvatarUploadProps) => {
    const { uploadAvatar } = useUser();
    const [avatarLoading, setAvatarLoading] = useState(false);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        try {
            setAvatarLoading(true);
            await uploadAvatar(file);
            toast.success("Avatar updated successfully");
        } catch (error) {
            toast.error("Failed to upload avatar");
        } finally {
            setAvatarLoading(false);
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
                <AvatarImage
                    src={user.profile.avatar}
                    alt={`${user.profile.firstName} ${user.profile.lastName}`}
                />
                <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                    {getInitials(user.profile.firstName, user.profile.lastName)}
                </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
                <Button
                    variant="outline"
                    disabled={avatarLoading}
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                >
                    {avatarLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload New Photo
                </Button>
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                />
                <p className="text-sm text-muted-foreground">
                    JPG, PNG or GIF. Max size 5MB.
                </p>
            </div>
        </div>
    );
}

export default AvatarUpload