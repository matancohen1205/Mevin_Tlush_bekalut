/** Horizontally scrolling row of track cards, or skeletons while loading. */
import type { Track } from "../../types";
import { CardSkeletons } from "../common/Skeleton";
import { TrackCard } from "../tracks";

/** Carousel for `tracks`; `null` means "still loading". */
export function TrackCarousel({ tracks }: { tracks: Track[] | null }) {
  if (!tracks) return <CardSkeletons />;
  return <div className="hscroll">{tracks.map((t) => <TrackCard key={t.id} track={t} queue={tracks} />)}</div>;
}
