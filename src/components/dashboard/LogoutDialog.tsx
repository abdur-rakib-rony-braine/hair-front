"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface LogoutDialogProps {
  triggerLabel?: string;
  triggerVariant?: "default" | "destructive" | "outline";
  className?: string;
}

export default function LogoutDialog({
  triggerLabel = "Logout",
  triggerVariant = "default",
  className = "",
}: LogoutDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={triggerVariant}
          className={`px-4 py-2 rounded-md shadow hover:shadow-lg transition-all ${className}`}
        >
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md rounded-lg border border-gray-200 shadow-lg p-6 bg-white">
        <AlertDialogHeader className="text-center">
          <AlertDialogTitle className="text-xl font-semibold text-gray-800">
            Confirm Logout
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 mt-2 text-sm">
            Are you sure you want to logout? You will need to login again to
            access your dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-end space-x-2 mt-4">
          <AlertDialogCancel className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all">
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-all"
            onClick={() => {
              handleLogout();
              setOpen(false);
            }}
          >
            Logout
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
