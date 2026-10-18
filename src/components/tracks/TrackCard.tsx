/** Square cover card used in horizontal carousels. Clicking plays the track within its list. */
import { usePlayer } from "../../state/player";
import type { Track } from "../../types";
import { tr, useLang } from "../../i18n";

/** A carousel card; `queue` becomes the play queue. */
export function TrackCard({ track, queue }: { track: Track; queue: Track[] }) {
  useLang();
  const { play } = usePlayer();
  return (
    <button className="card" onClick={() => play(track, queue)} aria-label={`${tr("נגן")} ${track.title} – ${track.artist}`}>
      <img className="art" src={track.artwork} alt="" loading="lazy" />
      <div className="t">{track.title}</div>
      <div className="a">{track.artist}</div>
    </button>
  );
}
