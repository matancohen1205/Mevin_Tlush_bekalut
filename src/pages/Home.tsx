import { useEffect, useState } from "react";
import { COUNTRIES, GENRES, MOODS, music, type Result } from "../services/music";
import { usePlayer } from "../state/player";
import { he } from "../i18n/he";
import { CardSkeletons, RowSkeletons } from "../components/Skeleton";
import { TrackCard, TrackRow } from "../components/Track";
import { Icon } from "../components/Icon";
import { Logo } from "../components/Logo";
import { usePrefs } from "../state/prefs";

export function Home({ themeBtn }: { themeBtn: React.ReactNode }) {
  const prefs = usePrefs();
  const [country, setCountry] = useState(prefs.country);
  const [forYou, setForYou] = useState<Result | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [charts, setCharts] = useState<Result | null>(null);
  const [moodTracks, setMoodTracks] = useState<Result | null>(null);
  const { play } = usePlayer();

  useEffect(() => {
    let live = true;
    setCharts(null);
    music.charts(country, 12).then((r) => live && setCharts(r));
    return () => { live = false; };
  }, [country]);

  useEffect(() => {
    if (!mood) return setMoodTracks(null);
    let live = true;
    setMoodTracks(null);
    const term = MOODS.find((m) => m.id === mood)!.term;
    music.search(term, country, 12).then((r) => live && setMoodTracks(r));
    return () => { live = false; };
  }, [mood, country]);

  useEffect(() => {
    if (!prefs.genres.length) return;
    let live = true;
    const term = prefs.genres.map((g) => GENRES.find((x) => x.id === g)?.term).filter(Boolean).slice(0, 2).join(" ");
    music.search(term, country, 12).then((r) => live && setForYou(r));
    return () => { live = false; };
  }, [prefs.genres, country]);

  const name = COUNTRIES.find((c) => c.code === country)!.name;
  const tracks = charts?.tracks ?? [];

  return (
    <main className="page">
      <header className="topbar">
        <div className="logo" lang="en">
          <Logo /> Wavely
        </div>
        {themeBtn}
      </header>

      <section className="hero section" aria-labelledby="hero-t">
        <h1 id="hero-t">{he.home.heroTitle}</h1>
        <p>{he.home.heroText}</p>
        <button className="btn" disabled={!tracks.length} onClick={() => play(tracks[0], tracks)}>
          <Icon name="play" size={18} /> {he.home.heroCta}
        </button>
      </section>

      {charts?.offline && <div className="banner" role="status">{he.home.offline}</div>}

      <section className="section" aria-label="מדינות">
        <div className="chip-row" role="group" aria-label="בחירת מדינה">
          {COUNTRIES.map((c) => (
            <button key={c.code} className="chip" aria-pressed={c.code === country} onClick={() => setCountry(c.code)}>
              {c.flag} {c.name}
            </button>
          ))}
        </div>
      </section>

      {prefs.genres.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>בשבילך</h2></div>
          {forYou ? <div className="hscroll">{forYou.tracks.map((t) => <TrackCard key={t.id} track={t} queue={forYou.tracks} />)}</div> : <CardSkeletons />}
        </section>
      )}

      <section className="section">
        <div className="section-head"><h2>{he.home.moods}</h2></div>
        <div className="chip-row" role="group" aria-label={he.home.moods}>
          {MOODS.map((m) => (
            <button key={m.id} className="chip" aria-pressed={mood === m.id} onClick={() => setMood(mood === m.id ? null : m.id)}>
              {m.label}
            </button>
          ))}
        </div>
        {mood && (moodTracks ? (
          <div className="hscroll">{moodTracks.tracks.map((t) => <TrackCard key={t.id} track={t} queue={moodTracks.tracks} />)}</div>
        ) : <CardSkeletons />)}
      </section>

      <section className="section">
        <div className="section-head"><h2>{he.home.inCountry(name)}</h2></div>
        {charts ? (
          <>
            <div className="hscroll">{tracks.slice(0, 6).map((t) => <TrackCard key={t.id} track={t} queue={tracks} />)}</div>
            <div className="rows" style={{ marginTop: 8 }}>{tracks.map((t, i) => <TrackRow key={t.id} track={t} queue={tracks} rank={i + 1} />)}</div>
          </>
        ) : (
          <><CardSkeletons /><RowSkeletons /></>
        )}
      </section>
    </main>
  );
}
