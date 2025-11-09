import { signupAction } from "./actions";
import SignupForm from "./SignupForm";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignupForm signupAction={signupAction} />
    </div>
  );
}
