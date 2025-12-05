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
import { useMarket } from "@/providers/MarketProvider";

interface LogoutDialogProps {
  triggerLabel?: string;
  triggerVariant?: "default" | "destructive" | "outline";
  className?: string;
}

export default function LogoutDialog({
  triggerLabel,
  triggerVariant = "default",
  className = "",
}: LogoutDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { locale } = useMarket();

  const getLocalizedText = () => {
    if (locale === 'fi') {
      return {
        logout: 'Kirjaudu Ulos',
        confirmLogout: 'Vahvista uloskirjautuminen',
        logoutDescription: 'Oletko varma, että haluat kirjautua ulos? Sinun täytyy kirjautua uudelleen sisään päästäksesi kojelaudalle.',
        cancel: 'Peruuta',
        confirm: 'Kirjaudu Ulos',
      };
    }
    if (locale === 'de') {
      return {
        logout: 'Abmelden',
        confirmLogout: 'Abmeldung bestätigen',
        logoutDescription: 'Sind Sie sicher, dass Sie sich abmelden möchten? Sie müssen sich erneut anmelden, um auf Ihr Dashboard zuzugreifen.',
        cancel: 'Abbrechen',
        confirm: 'Abmelden',
      };
    }
    return {
      logout: 'Logout',
      confirmLogout: 'Confirm Logout',
      logoutDescription: 'Are you sure you want to logout? You will need to login again to access your dashboard.',
      cancel: 'Cancel',
      confirm: 'Logout',
    };
  };

  const localized = getLocalizedText();

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
          className={className}
        >
          {triggerLabel || localized.logout}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center">
          <AlertDialogTitle className="text-xl font-semibold">
            {localized.confirmLogout}
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-sm">
            {localized.logoutDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-end space-x-2 mt-4">
          <AlertDialogCancel className="px-4 py-2">
            {localized.cancel}
          </AlertDialogCancel>
          <Button
            variant="destructive"
            className="px-4 py-2 cursor-pointer"
            onClick={() => {
              handleLogout();
              setOpen(false);
            }}
          >
            {localized.confirm}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}