import { he } from "../i18n/he";
import { Icon } from "./Icon";

export type Tab = "home" | "search" | "library" | "community" | "profile";
const TABS: Tab[] = ["home", "search", "library", "community", "profile"];

export function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="nav" aria-label="ניווט ראשי">
      {TABS.map((t) => (
        <button key={t} onClick={() => onChange(t)} aria-current={tab === t ? "page" : undefined}>
          <Icon name={t} />
          {he.nav[t]}
        </button>
      ))}
    </nav>
  );
}
