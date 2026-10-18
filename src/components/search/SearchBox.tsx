/** Rounded search input with a clear button. */
import { tr, useLang } from "../../i18n";
import { Icon } from "../common/Icon";

/** Controlled search field. */
export function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  useLang();
  return (
    <div className="searchbox">
      <Icon name="search" size={20} />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={tr("שיר, אמן, אלבום או ז׳אנר")} aria-label={tr("חיפוש מוזיקה")} />
      {value && <button className="icon-btn" onClick={() => onChange("")} aria-label={tr("נקה")}><Icon name="close" size={18} /></button>}
    </div>
  );
}
