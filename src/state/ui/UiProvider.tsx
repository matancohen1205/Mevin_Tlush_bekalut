/** Holds the open dialog, the current sub-page route and the toast message. */
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { tr } from "../../i18n";
import { UiContext, type Route, type Sheet } from "./UiContext";

const TOAST_MS = 2200;

/** Provides UI state to the tree. */
export function UiProvider({ children }: { children: ReactNode }) {
  const [sheet, setSheet] = useState<Sheet>(null);
  const [route, setRoute] = useState<Route>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    const text = tr(message);
    setToast(text);
    setTimeout(() => setToast((current) => (current === text ? null : current)), TOAST_MS);
  }, []);

  const api = useMemo(() => ({ sheet, setSheet, route, setRoute, toast, showToast }), [sheet, route, toast, showToast]);
  return <UiContext.Provider value={api}>{children}</UiContext.Provider>;
}
