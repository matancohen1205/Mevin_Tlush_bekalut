/** Mosaic cover made from up to four track covers (or a placeholder icon when empty). */
import { Icon } from "../common/Icon";

/** `size` is the square edge in pixels. */
export function PlaylistCover({ tracks, size = 56 }: { tracks: { artwork: string }[]; size?: number }) {
  const covers = tracks.slice(0, 4);
  const single = covers.length < 4;
  return (
    <div className="mosaic" style={{ width: size, height: size }}>
      {covers.length
        ? covers.map((t, i) => <img key={i} src={t.artwork} alt="" style={single ? { gridColumn: "1 / -1", gridRow: "1 / -1" } : undefined} hidden={single && i > 0} />)
        : <span><Icon name="library" size={size / 2.4} /></span>}
    </div>
  );
}
