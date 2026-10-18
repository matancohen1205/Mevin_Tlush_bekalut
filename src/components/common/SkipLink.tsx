/** Keyboard "skip to content" link, visible only when focused. */
import { tr, useLang } from "../../i18n";

/** Moves focus to the page's <main> element. */
export function SkipLink() {
  useLang();
  return (
    <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>
      {tr("דלג לתוכן")}
    </a>
  );
}
