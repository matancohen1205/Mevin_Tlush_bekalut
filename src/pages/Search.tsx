import { useEffect, useState } from "react";
import { COUNTRIES, GENRES, music, type Result } from "../services/music";
import { usePrefs } from "../state/prefs";
import { Icon } from "../components/Icon";
import { RowSkeletons } from "../components/Skeleton";
import { TrackRow } from "../components/Track";
import { tr, useLang } from "../i18n";

export function Search() {
  useLang();
  const prefs = usePrefs();
  const [q, setQ] = useState("");
  const [country, setCountry] = useState(prefs.country);
  const [res, setRes] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const term = q.trim();

  useEffect(() => {
    if (!term) { setRes(null); setLoading(false); return; }
    let live = true;
    setLoading(true);
    const id = setTimeout(() => {
      music.search(term, country, 25).then((r) => { if (live) { setRes(r); setLoading(false); } });
    }, 350);
    return () => { live = false; clearTimeout(id); };
  }, [term, country]);

  return (
    <main className="page">
      <h1 className="page-title">{tr("חיפוש")}</h1>
      <div className="searchbox">
        <Icon name="search" size={20} />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr("שיר, אמן, אלבום או ז׳אנר")} aria-label={tr("חיפוש מוזיקה")} />
        {q && <button className="icon-btn" onClick={() => setQ("")} aria-label={tr("נקה")}><Icon name="close" size={18} /></button>}
      </div>
      <div className="chip-row" role="group" aria-label={tr("חיפוש לפי מדינה")} style={{ marginTop: 8 }}>
        {COUNTRIES.map((c) => (
          <button key={c.code} className="chip" aria-pressed={c.code === country} onClick={() => setCountry(c.code)}>{c.flag} {tr(c.name)}</button>
        ))}
      </div>

      {!term ? (
        <section className="section">
          <div className="section-head"><h2>{tr("גלו לפי ז׳אנר")}</h2></div>
          <div className="tiles">
            {GENRES.map((g) => (
              <button key={g.id} className="tile" style={{ "--h": g.hue } as React.CSSProperties} onClick={() => setQ(g.term)}>{tr(g.label)}</button>
            ))}
          </div>
        </section>
      ) : loading || !res ? (
        <section className="section"><RowSkeletons /></section>
      ) : (
        <section className="section">
          {res.offline && <div className="banner" role="status">{tr("מצב דמה: אין חיבור למקור המוזיקה.")}</div>}
          {res.tracks.length ? (
            <div className="rows">{res.tracks.map((t) => <TrackRow key={t.id} track={t} queue={res.tracks} />)}</div>
          ) : (
            <div className="empty"><div className="big">🔎</div><p>{tr("לא נמצאו תוצאות ל״{term}״", { term })}</p></div>
          )}
        </section>
      )}
    </main>
  );
}
