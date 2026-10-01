import { createContext, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { en } from "./en";

/**
 * Hebrew is the source language: the Hebrew text itself is the key, and `en.ts` maps it to English.
 * A missing translation falls back to the Hebrew text, so a gap never breaks the UI.
 * `{name}` placeholders are filled from the second argument.
 */
export type Lang = "he" | "en";
const KEY = "wavely.lang";

function detect(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "he" || saved === "en") return saved;
  } catch { /* ignore */ }
  return navigator.language?.toLowerCase().startsWith("he") ? "he" : "en";
}

let current: Lang = detect();

/** Non-hook translate for code outside components (reads the language last set by the provider). */
export function tr(key: string, vars?: Record<string, string | number>): string {
  let s = current === "en" ? en[key] ?? key : key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
  return s;
}

export const locale = () => (current === "he" ? "he-IL" : "en-US");

interface I18n { lang: Lang; dir: "rtl" | "ltr"; setLang: (l: Lang) => void; t: typeof tr }
const Ctx = createContext<I18n | null>(null);
export const useI18n = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n outside I18nProvider");
  return c;
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(current);
  current = lang;
  const dir = lang === "he" ? "rtl" : "ltr";

  useLayoutEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.title = tr("Wavely – מוזיקה מכל העולם");
    try { localStorage.setItem(KEY, lang); } catch { /* ignore */ }
  }, [lang, dir]);

  const value = useMemo<I18n>(() => ({ lang, dir, setLang: setLangState, t: tr }), [lang, dir]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Subscribes a component to language changes (components call `tr()` directly). */
export const useLang = () => useI18n().lang;
