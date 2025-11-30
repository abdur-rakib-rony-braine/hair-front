"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";
import { Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingSpinner } from "../re-usable/loading-spinner";
import LogoutDialog from "./LogoutDialog";

const UserAvatarDropdown = () => {
  const router = useRouter();
  const { user, loading } = useUser();
  const [open, setOpen] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleEditProfile = () => {
    setOpen(false);
    router.push("/dashboard/edit-profile");
  };

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <LoadingSpinner size={35} color="gray" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.profile.avatar}
              alt={`${user?.profile.firstName} ${user?.profile.lastName}`}
            />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {user ? getInitials(user.profile.firstName, user.profile.lastName) : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.profile.firstName} {user?.profile.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEditProfile}>
          <User className="mr-2 h-4 w-4" />
          <span>Edit Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="p-1">
          <LogoutDialog />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserAvatarDropdown