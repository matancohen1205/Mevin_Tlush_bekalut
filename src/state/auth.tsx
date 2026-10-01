import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../services/supabase";

interface AuthState {
  /** false when no Supabase keys exist: the app is local-only and never asks for login */
  enabled: boolean;
  loading: boolean;
  userId: string | null;
  email: string | null;
  guest: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  /** returns an error message, or null. `needsConfirm` is true when a verification email was sent */
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null; needsConfirm: boolean }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  leaveGuest: () => void;
}

const Ctx = createContext<AuthState | null>(null);
export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside AuthProvider");
  return c;
};

const GUEST_KEY = "wavely.guest";
const HE_ERRORS: [RegExp, string][] = [
  [/invalid login credentials/i, "האימייל או הסיסמה שגויים."],
  [/already registered|already been registered/i, "האימייל הזה כבר רשום. נסו להתחבר."],
  [/password should be at least/i, "הסיסמה קצרה מדי (לפחות 6 תווים)."],
  [/email not confirmed/i, "האימייל עוד לא אומת. בדקו את תיבת הדואר."],
  [/rate limit|too many/i, "יותר מדי ניסיונות. נסו שוב בעוד כמה דקות."],
  [/failed to fetch|network/i, "אין חיבור לשרת. בדקו את האינטרנט ונסו שוב."],
];
const he = (m: string) => HE_ERRORS.find(([re]) => re.test(m))?.[1] ?? "משהו השתבש. נסו שוב.";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!!supabase);
  const [guest, setGuest] = useState(() => {
    try { return localStorage.getItem(GUEST_KEY) === "1"; } catch { return false; }
  });

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); }).catch(() => setLoading(false));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const setGuestFlag = (v: boolean) => {
    setGuest(v);
    try { v ? localStorage.setItem(GUEST_KEY, "1") : localStorage.removeItem(GUEST_KEY); } catch { /* ignore */ }
  };

  const value: AuthState = {
    enabled: !!supabase,
    loading,
    userId: session?.user.id ?? null,
    email: session?.user.email ?? null,
    guest,
    signIn: async (email, password) => {
      try {
        const { error } = await supabase!.auth.signInWithPassword({ email, password });
        if (!error) setGuestFlag(false);
        return error ? he(error.message) : null;
      } catch (e) { return he(String(e)); }
    },
    signUp: async (email, password, name) => {
      try {
        const { data, error } = await supabase!.auth.signUp({ email, password, options: { data: { name } } });
        if (error) return { error: he(error.message), needsConfirm: false };
        if (data.session) setGuestFlag(false);
        return { error: null, needsConfirm: !data.session };
      } catch (e) { return { error: he(String(e)), needsConfirm: false }; }
    },
    signOut: async () => { await supabase?.auth.signOut(); },
    continueAsGuest: () => setGuestFlag(true),
    leaveGuest: () => setGuestFlag(false),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
