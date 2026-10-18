/** Ranked list of the charts (carousel on top, numbered rows below). */
import type { Track } from "../../types";
import { useLang } from "../../i18n";
import { CardSkeletons, RowSkeletons } from "../common/Skeleton";
import { TrackCard, TrackRow } from "../tracks";

const CAROUSEL_COUNT = 6;

/** `tracks` is null while loading; `heading` is the already-translated section title. */
export function ChartsSection({ tracks, heading }: { tracks: Track[] | null; heading: string }) {
  useLang();
  return (
    <section className="section">
      <div className="section-head"><h2>{heading}</h2></div>
      {tracks ? (
        <>
          <div className="hscroll">{tracks.slice(0, CAROUSEL_COUNT).map((t) => <TrackCard key={t.id} track={t} queue={tracks} />)}</div>
          <div className="rows" style={{ marginTop: 8 }}>{tracks.map((t, i) => <TrackRow key={t.id} track={t} queue={tracks} rank={i + 1} />)}</div>
        </>
      ) : <><CardSkeletons /><RowSkeletons /></>}
    </section>
  );
}
