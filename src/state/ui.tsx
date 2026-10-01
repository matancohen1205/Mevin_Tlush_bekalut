import { createContext, useContext, useState, type ReactNode } from "react";
import type { Track } from "../types";

export type Sheet = { kind: "add"; track: Track } | { kind: "new" } | null;
interface UiState {
  sheet: Sheet;
  setSheet: (s: Sheet) => void;
  toast: string | null;
  showToast: (m: string) => void;
}
const Ctx = createContext<UiState | null>(null);
export const useUi = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useUi outside UiProvider");
  return c;
};

export function UiProvider({ children }: { children: ReactNode }) {
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast((t) => (t === m ? null : t)), 2200);
  };
  return <Ctx.Provider value={{ sheet, setSheet, toast, showToast }}>{children}</Ctx.Provider>;
}
