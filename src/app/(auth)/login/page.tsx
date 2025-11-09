import { loginAction } from "./actions";
import LoginForm from "./LoginForm";

export default function Page() {
  return <div className="flex items-center justify-center min-h-screen"><LoginForm loginAction={loginAction} /></div>
}
