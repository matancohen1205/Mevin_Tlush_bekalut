/** First-run dialog: pick favourite genres and a country, which personalise the home page. */
import { useState } from "react";
import { useDialog } from "../../hooks/useDialog";
import { genresLeft, toggleGenre } from "../../domain/onboarding";
import { tr, useLang } from "../../i18n";
import { COUNTRIES } from "../../state/catalog";
import { usePrefs } from "../../state/prefs";
import { LangSwitch } from "../common/LangSwitch";
import { Logo } from "../common/Logo";
import { GenreGrid } from "./GenreGrid";

/** Hidden once the user has finished (or skipped) it. */
export function Onboarding() {
  useLang();
  const prefs = usePrefs();
  const dialog = useDialog<HTMLDivElement>();
  const [genres, setGenres] = useState<string[]>([]);
  const [country, setCountry] = useState(prefs.country);
  if (prefs.onboarded) return null;
  const left = genresLeft(genres);

  return (
    <div ref={dialog} tabIndex={-1} className="onboard" role="dialog" aria-modal="true" aria-label={tr("ברוכים הבאים")}>
      <div className="onboard-in">
        <div className="topbar"><div className="logo" lang="en"><Logo /> Wavely</div><LangSwitch /></div>
        <h1>{tr("מה מתאים לכם?")}</h1>
        <p className="muted">{tr("בחרו לפחות 3 סגנונות ואנחנו נתאים לכם המלצות.")}</p>
        <GenreGrid selected={genres} onToggle={(id) => setGenres((g) => toggleGenre(g, id))} />
        <label className="lbl" htmlFor="c">{tr("המדינה שלכם")}</label>
        <select id="c" className="input" value={country} onChange={(e) => setCountry(e.target.value)}>
          {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.flag} {tr(c.name)}</option>)}
        </select>
        <button className="btn primary wide" disabled={left > 0} onClick={() => prefs.save({ onboarded: true, genres, country })}>
          {left > 0 ? tr("בחרו עוד {n}", { n: left }) : tr("בואו נתחיל")}
        </button>
        <button className="skip" onClick={() => prefs.save({ onboarded: true, genres: [], country })}>{tr("דלגו בינתיים")}</button>
      </div>
    </div>
  );
}
