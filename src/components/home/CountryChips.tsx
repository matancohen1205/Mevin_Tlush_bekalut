/** Horizontal chip list for choosing a country. */
import { COUNTRIES } from "../../services/music";
import { tr, useLang } from "../../i18n";

interface Props {
  value: string;
  onChange: (code: string) => void;
  /** accessible name of the group */
  label?: string;
}

/** One chip per supported country. */
export function CountryChips({ value, onChange, label }: Props) {
  useLang();
  return (
    <div className="chip-row" role="group" aria-label={label ?? tr("בחירת מדינה")}>
      {COUNTRIES.map((c) => (
        <button key={c.code} className="chip" aria-pressed={c.code === value} onClick={() => onChange(c.code)}>{c.flag} {tr(c.name)}</button>
      ))}
    </div>
  );
}
