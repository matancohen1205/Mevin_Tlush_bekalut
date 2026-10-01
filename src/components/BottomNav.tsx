import { he } from "../i18n/he";
import { Icon } from "./Icon";

export type Tab = "home" | "search" | "library" | "community" | "profile";
const TABS: Tab[] = ["home", "search", "library", "community", "profile"];

export function BottomNav({ tab, onChange, badge = {} }: { tab: Tab; onChange: (t: Tab) => void; badge?: Partial<Record<Tab, number>> }) {
  return (
    <nav className="nav" aria-label="ניווט ראשי">
      {TABS.map((t) => (
        <button key={t} onClick={() => onChange(t)} aria-current={tab === t ? "page" : undefined}>
          <span className="nav-ic"><Icon name={t} />{!!badge[t] && <i className="badge">{badge[t]}</i>}</span>
          {he.nav[t]}
        </button>
      ))}
    </nav>
  );
}
