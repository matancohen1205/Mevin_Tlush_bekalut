/** Mood chips (chill, focus…) and the tracks for the selected one. */
import { useState } from "react";
import { MOODS } from "../../state/catalog";
import { useMoodTracks } from "../../state/catalog";
import { usePrefs } from "../../state/prefs";
import { tr, useLang } from "../../i18n";
import { TrackCarousel } from "./TrackCarousel";

/** Selecting a chip loads matching tracks; selecting it again clears them. */
export function MoodSection({ country }: { country: string }) {
  useLang();
  const { source } = usePrefs();
  const [mood, setMood] = useState<string | null>(null);
  const result = useMoodTracks(mood, country, source);
  return (
    <section className="section">
      <div className="section-head"><h2>{tr("מצב רוח")}</h2></div>
      <div className="chip-row" role="group" aria-label={tr("מצב רוח")}>
        {MOODS.map((m) => (
          <button key={m.id} className="chip" aria-pressed={mood === m.id} onClick={() => setMood(mood === m.id ? null : m.id)}>{tr(m.label)}</button>
        ))}
      </div>
      {mood && <TrackCarousel tracks={result?.tracks ?? null} />}
    </section>
  );
}
