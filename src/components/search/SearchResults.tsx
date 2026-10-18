/** Result list for a search: loading skeletons, offline notice, rows, or an empty state. */
import type { Result } from "../../state/catalog";
import { tr, useLang } from "../../i18n";
import { RowSkeletons } from "../common/Skeleton";
import { TrackRow } from "../tracks";

/** `result` is null while nothing has arrived yet. */
export function SearchResults({ term, result, loading }: { term: string; result: Result | null; loading: boolean }) {
  useLang();
  if (loading || !result) return <section className="section"><RowSkeletons /></section>;
  return (
    <section className="section">
      {result.offline && <div className="banner" role="status">{tr("מצב דמה: אין חיבור למקור המוזיקה.")}</div>}
      {result.tracks.length ? (
        <div className="rows">{result.tracks.map((t) => <TrackRow key={t.id} track={t} queue={result.tracks} />)}</div>
      ) : (
        <div className="empty"><div className="big">🔎</div><p>{tr("לא נמצאו תוצאות ל״{term}״", { term })}</p></div>
      )}
    </section>
  );
}
