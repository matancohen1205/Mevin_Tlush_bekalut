/** Shows the sign-in screen when cloud accounts are configured and the user is neither signed in nor a guest. */
import type { ReactNode } from "react";
import { AuthScreen } from "../components/onboarding/AuthScreen";
import { useAuth } from "../state/auth";

/** Renders `children` once access is allowed; renders nothing while the session is loading. */
export function AuthGate({ children }: { children: ReactNode }) {
  const auth = useAuth();
  if (auth.enabled && auth.loading) return null;
  if (auth.enabled && !auth.userId && !auth.guest) return <AuthScreen />;
  return <>{children}</>;
}
