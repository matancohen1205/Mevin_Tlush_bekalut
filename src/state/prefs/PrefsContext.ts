/** User preferences (onboarding result, country, music source). */
import { createContext, useContext } from "react";

export interface Prefs {
  onboarded: boolean;
  genres: string[];
  country: string;
  source: "itunes" | "audius";
}

export interface PrefsApi extends Prefs {
  /** Merges a partial update into the saved preferences. */
  save: (patch: Partial<Prefs>) => void;
}

export const DEFAULT_PREFS: Prefs = { onboarded: false, genres: [], country: "il", source: "itunes" };
export const PrefsContext = createContext<PrefsApi | null>(null);

/** Access preferences from any component under PrefsProvider. */
export function usePrefs(): PrefsApi {
  const api = useContext(PrefsContext);
  if (!api) throw new Error("usePrefs outside PrefsProvider");
  return api;
}
