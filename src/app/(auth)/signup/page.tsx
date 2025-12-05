import { signupAction } from "./actions";
import SignupForm from "./SignupForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="absolute top-0 right-0 p-4 flex items-center space-x-2">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>
      <SignupForm signupAction={signupAction} />
    </div>
  );
}