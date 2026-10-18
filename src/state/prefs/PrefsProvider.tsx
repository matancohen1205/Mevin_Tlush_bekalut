import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface Prefs { onboarded: boolean; genres: string[]; country: string; source: "itunes" | "audius" }
interface PrefsState extends Prefs { save: (p: Partial<Prefs>) => void }

const KEY = "wavely.prefs.v1";
const DEFAULT: Prefs = { onboarded: false, genres: [], country: "il", source: "itunes" };
const Ctx = createContext<PrefsState | null>(null);
export const usePrefs = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePrefs outside PrefsProvider");
  return c;
};

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [p, setP] = useState<Prefs>(() => {
    try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") }; } catch { return DEFAULT; }
  });
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* ignore */ }
  }, [p]);
  return <Ctx.Provider value={{ ...p, save: (x) => setP((o) => ({ ...o, ...x })) }}>{children}</Ctx.Provider>;
}
