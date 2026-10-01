import { createContext, useContext, useState, type ReactNode } from "react";
import { tr } from "../i18n";
import type { Track } from "../types";

export type Sheet =
  | { kind: "add"; track: Track }
  | { kind: "new" }
  | { kind: "comments"; postId: string }
  | { kind: "compose" }
  | { kind: "editProfile" }
  | { kind: "more"; postId?: string; userId: string }
  | null;

/** Pages that replace the current tab content (with a back button). */
export type Route = { kind: "user"; id: string } | { kind: "notifs" } | null;

interface UiState {
  sheet: Sheet;
  setSheet: (s: Sheet) => void;
  route: Route;
  setRoute: (r: Route) => void;
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
  const [route, setRoute] = useState<Route>(null);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => {
    const msg = tr(m);
    setToast(msg);
    setTimeout(() => setToast((t) => (t === msg ? null : t)), 2200);
  };
  return <Ctx.Provider value={{ sheet, setSheet, route, setRoute, toast, showToast }}>{children}</Ctx.Provider>;
}
