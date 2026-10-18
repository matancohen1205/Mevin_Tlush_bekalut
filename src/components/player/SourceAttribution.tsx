/** Credit line for where the audio comes from, with a link back to the source when available. */
import type { Track } from "../../types";
import { tr, useLang } from "../../i18n";

const CREDIT = {
  itunes: "תצוגה מקדימה של 30 שניות · באדיבות Apple Music",
  audius: "שיר מלא · באדיבות Audius",
  demo: "שיר דמה שנוצר במחשב",
} as const;

/** Attribution under the player. */
export function SourceAttribution({ track }: { track: Track }) {
  useLang();
  return (
    <p className="attrib">
      {tr(CREDIT[track.source])}
      {track.sourceUrl && <> · <a href={track.sourceUrl} target="_blank" rel="noreferrer">{tr("פתיחה במקור")}</a></>}
    </p>
  );
}
