/** Loads preferences from storage and persists every change. */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { readJson, writeJson } from "../../services/storage/localStore";
import { DEFAULT_PREFS, PrefsContext, type Prefs } from "./PrefsContext";

const STORAGE_KEY = "wavely.prefs.v1";

/** Provides preferences to the tree. */
export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(() => ({ ...DEFAULT_PREFS, ...readJson<Partial<Prefs>>(STORAGE_KEY, {}) }));
  useEffect(() => writeJson(STORAGE_KEY, prefs), [prefs]);

  const api = useMemo(() => ({ ...prefs, save: (patch: Partial<Prefs>) => setPrefs((old) => ({ ...old, ...patch })) }), [prefs]);
  return <PrefsContext.Provider value={api}>{children}</PrefsContext.Provider>;
}
