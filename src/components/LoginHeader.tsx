"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function LoginHeader() {
  return (
    <header className="absolute top-0 right-0 p-4 flex items-center space-x-2">
      <LocaleSwitcher />
      <ThemeToggle />
    </header>
  );
}