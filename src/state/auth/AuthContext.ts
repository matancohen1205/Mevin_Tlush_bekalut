/** Authentication state and actions exposed to the UI. */
import { createContext, useContext } from "react";

export interface AuthApi {
  /** false when no Supabase keys exist: the app is local-only and never asks for login */
  enabled: boolean;
  loading: boolean;
  userId: string | null;
  email: string | null;
  guest: boolean;
  /** Resolves to an error message, or null on success. */
  signIn: (email: string, password: string) => Promise<string | null>;
  /** `needsConfirm` is true when a verification email was sent. */
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null; needsConfirm: boolean }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  leaveGuest: () => void;
}

export const AuthContext = createContext<AuthApi | null>(null);

/** Access auth from any component under AuthProvider. */
export function useAuth(): AuthApi {
  const api = useContext(AuthContext);
  if (!api) throw new Error("useAuth outside AuthProvider");
  return api;
}
