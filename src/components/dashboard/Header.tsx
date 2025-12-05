import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import LogoutDialog from "./LogoutDialog";

export default function Header({ title }: { title: string }) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>

      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <LocaleSwitcher />
        <span className="text-muted-foreground text-sm px-2">Admin</span>
        <LogoutDialog className="cursor-pointer" />
      </div>
    </header>
  );
}