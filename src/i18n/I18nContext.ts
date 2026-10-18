/** Language state for components: the current language, its direction, and a setter. */
import { createContext, useContext } from "react";
import type { Lang } from "./translate";

export interface I18nApi {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (lang: Lang) => void;
}

export const I18nContext = createContext<I18nApi | null>(null);

/** Access language state (throws outside I18nProvider). */
export function useI18n(): I18nApi {
  const api = useContext(I18nContext);
  if (!api) throw new Error("useI18n outside I18nProvider");
  return api;
}

/** Subscribes a component to language changes (components call `tr()` directly). */
export const useLang = (): Lang => useI18n().lang;
