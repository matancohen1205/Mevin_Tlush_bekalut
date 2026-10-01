import { Icon } from "./Icon";
import { tr, useLang } from "../i18n";

export type Tab = "home" | "search" | "library" | "community" | "profile";
const TABS: Tab[] = ["home", "search", "library", "community", "profile"];
const LABEL: Record<Tab, string> = { home: "בית", search: "חיפוש", library: "ספרייה", community: "קהילה", profile: "פרופיל" };

export function BottomNav({ tab, onChange, badge = {} }: { tab: Tab; onChange: (t: Tab) => void; badge?: Partial<Record<Tab, number>> }) {
  useLang();
  return (
    <nav className="nav" aria-label={tr("ניווט ראשי")}>
      {TABS.map((t) => (
        <button key={t} onClick={() => onChange(t)} aria-current={tab === t ? "page" : undefined}>
          <span className="nav-ic"><Icon name={t} />{!!badge[t] && <i className="badge">{badge[t]}</i>}</span>
          {tr(LABEL[t])}
        </button>
      ))}
    </nav>
  );
}
