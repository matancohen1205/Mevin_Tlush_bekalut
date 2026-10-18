/** Large album cover that gently "breathes" while music plays. */
import type { Track } from "../../types";

/** Cover image for the current track. */
export function CoverArt({ track, playing }: { track: Track; playing: boolean }) {
  return (
    <div className="cover-wrap">
      <img className="cover" data-playing={playing} src={track.artwork} alt={`${track.title} – ${track.artist}`} />
    </div>
  );
}
