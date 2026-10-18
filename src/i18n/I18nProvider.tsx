/** Keeps the language in React state, updates <html lang/dir> and the page title when it changes. */
import { useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { I18nContext } from "./I18nContext";
import { currentLanguage, setCurrentLanguage, tr, type Lang } from "./translate";

/** Provides language state to the tree. */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(currentLanguage);
  setCurrentLanguage(lang); // keep `tr` in step with the state during render
  const dir = lang === "he" ? "rtl" : "ltr";

  useLayoutEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.title = tr("Wavely – מוזיקה מכל העולם");
  }, [lang, dir]);

  const api = useMemo(() => ({ lang, dir, setLang: setLangState }) as const, [lang, dir]);
  return <I18nContext.Provider value={api}>{children}</I18nContext.Provider>;
}
