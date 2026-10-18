/** Title, artist and the like button of the current track. */
import type { Track } from "../../types";
import { LikeButton } from "../tracks";

/** Text block of the full player. */
export function TrackInfo({ track }: { track: Track }) {
  return (
    <div className="info">
      <div className="meta">
        <h2>{track.title}</h2>
        <div className="artist">{track.artist}</div>
      </div>
      <LikeButton track={track} size={28} />
    </div>
  );
}
