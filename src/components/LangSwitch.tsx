import { useI18n } from "../i18n";

/** Switches between Hebrew (RTL) and English (LTR). The label names the language you will get. */
export function LangSwitch({ className = "chip" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <button type="button" className={className} lang={lang === "he" ? "en" : "he"} onClick={() => setLang(lang === "he" ? "en" : "he")} aria-label={lang === "he" ? "Switch to English" : "מעבר לעברית"}>
      {lang === "he" ? "English" : "עברית"}
    </button>
  );
}
