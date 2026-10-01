import { useState } from "react";
import { COUNTRIES, GENRES } from "../services/music";
import { usePrefs } from "../state/prefs";
import { Logo } from "./Logo";

export function Onboarding() {
  const prefs = usePrefs();
  const [genres, setGenres] = useState<string[]>([]);
  const [country, setCountry] = useState(prefs.country);
  if (prefs.onboarded) return null;
  const toggle = (id: string) => setGenres((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));
  const left = Math.max(0, 3 - genres.length);

  return (
    <div className="onboard" role="dialog" aria-modal="true" aria-label="ברוכים הבאים">
      <div className="onboard-in">
        <div className="logo" lang="en"><Logo /> Wavely</div>
        <h1>מה מתאים לכם?</h1>
        <p className="muted">בחרו לפחות 3 סגנונות ואנחנו נתאים לכם המלצות.</p>
        <div className="tiles">
          {GENRES.map((g) => (
            <button key={g.id} className="tile" aria-pressed={genres.includes(g.id)} style={{ "--h": g.hue } as React.CSSProperties} onClick={() => toggle(g.id)}>
              {g.label}
            </button>
          ))}
        </div>
        <label className="lbl" htmlFor="c">המדינה שלכם</label>
        <select id="c" className="input" value={country} onChange={(e) => setCountry(e.target.value)}>
          {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
        </select>
        <button className="btn primary wide" disabled={left > 0} onClick={() => prefs.save({ onboarded: true, genres, country })}>
          {left > 0 ? `בחרו עוד ${left}` : "בואו נתחיל"}
        </button>
        <button className="skip" onClick={() => prefs.save({ onboarded: true, genres: [], country })}>דלגו בינתיים</button>
      </div>
    </div>
  );
}
