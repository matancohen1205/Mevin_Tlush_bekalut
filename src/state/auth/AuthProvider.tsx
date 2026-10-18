/** Wires the auth API to React state: session, loading flag and the guest-mode choice. */
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchSession, isCloudEnabled, onSessionChange, signInWithPassword, signOutRequest, signUpWithPassword } from "../../services/cloud/authApi";
import { readString, removeKey, writeString } from "../../services/storage/localStore";
import { AuthContext, type AuthApi } from "./AuthContext";
import { friendlyAuthError } from "./authErrors";
import type { Session } from "@supabase/supabase-js";

const GUEST_KEY = "wavely.guest";

/** Provides auth state to the tree. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const enabled = isCloudEnabled();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [guest, setGuest] = useState(() => readString(GUEST_KEY) === "1");

  useEffect(() => {
    if (!enabled) return;
    fetchSession().then(setSession).catch(() => undefined).finally(() => setLoading(false));
    return onSessionChange(setSession);
  }, [enabled]);

  /** Remembers whether the user chose guest mode. */
  const setGuestMode = useCallback((value: boolean) => {
    setGuest(value);
    if (value) writeString(GUEST_KEY, "1");
    else removeKey(GUEST_KEY);
  }, []);

  const api = useMemo<AuthApi>(
    () => ({
      enabled, loading, guest,
      userId: session?.user.id ?? null,
      email: session?.user.email ?? null,
      signIn: async (email, password) => {
        try {
          const error = await signInWithPassword(email, password);
          if (!error) setGuestMode(false);
          return error ? friendlyAuthError(error) : null;
        } catch (e) { return friendlyAuthError(String(e)); }
      },
      signUp: async (email, password, name) => {
        try {
          const result = await signUpWithPassword(email, password, name);
          if (!result.error && !result.needsConfirm) setGuestMode(false);
          return { error: result.error ? friendlyAuthError(result.error) : null, needsConfirm: result.needsConfirm };
        } catch (e) { return { error: friendlyAuthError(String(e)), needsConfirm: false }; }
      },
      signOut: signOutRequest,
      continueAsGuest: () => setGuestMode(true),
      leaveGuest: () => setGuestMode(false),
    }),
    [enabled, loading, guest, session, setGuestMode],
  );
  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}
