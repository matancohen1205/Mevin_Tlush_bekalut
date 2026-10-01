import { useState } from "react";
import { COUNTRIES, GENRES } from "../services/music";
import { usePrefs } from "../state/prefs";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";
import { tr, useLang } from "../i18n";

export function Onboarding() {
  useLang();
  const prefs = usePrefs();
  const [genres, setGenres] = useState<string[]>([]);
  const [country, setCountry] = useState(prefs.country);
  if (prefs.onboarded) return null;
  const toggle = (id: string) => setGenres((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));
  const left = Math.max(0, 3 - genres.length);

  return (
    <div className="onboard" role="dialog" aria-modal="true" aria-label={tr("ברוכים הבאים")}>
      <div className="onboard-in">
        <div className="topbar"><div className="logo" lang="en"><Logo /> Wavely</div><LangSwitch /></div>
        <h1>{tr("מה מתאים לכם?")}</h1>
        <p className="muted">{tr("בחרו לפחות 3 סגנונות ואנחנו נתאים לכם המלצות.")}</p>
        <div className="tiles">
          {GENRES.map((g) => (
            <button key={g.id} className="tile" aria-pressed={genres.includes(g.id)} style={{ "--h": g.hue } as React.CSSProperties} onClick={() => toggle(g.id)}>
              {tr(g.label)}
            </button>
          ))}
        </div>
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
