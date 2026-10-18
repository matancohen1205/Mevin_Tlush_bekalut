/** Private / public switch for a playlist. */
import { tr, useLang } from "../../i18n";
import type { Playlist } from "../../types";
import { Icon } from "../common/Icon";

/** Two-option radio group. */
export function VisibilityToggle({ value, onChange }: { value: Playlist["visibility"]; onChange: (v: Playlist["visibility"]) => void }) {
  useLang();
  return (
    <div className="seg" role="radiogroup" aria-label={tr("פרטיות")} style={{ marginTop: 12 }}>
      <button role="radio" aria-checked={value === "private"} aria-selected={value === "private"} onClick={() => onChange("private")}><Icon name="lock" size={16} /> {tr("פרטי")}</button>
      <button role="radio" aria-checked={value === "public"} aria-selected={value === "public"} onClick={() => onChange("public")}><Icon name="globe" size={16} /> {tr("ציבורי")}</button>
    </div>
  );
}
