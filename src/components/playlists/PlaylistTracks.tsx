/** Tracks of a playlist: drag to reorder, × to remove. */
import { useRef } from "react";
import { useLibrary } from "../../state/library";
import type { Playlist } from "../../types";
import { tr, useLang } from "../../i18n";
import { Icon } from "../common/Icon";
import { TrackRow } from "../tracks";

/** Reorderable list with an empty state. */
export function PlaylistTracks({ playlist }: { playlist: Playlist }) {
  useLang();
  const { reorderPlaylist, removeFromPlaylist } = useLibrary();
  const dragFrom = useRef<number | null>(null);
  if (!playlist.tracks.length) return <div className="empty"><div className="big">➕</div><p>{tr("הפלייליסט ריק. לחצו על + ליד שיר כדי להוסיף.")}</p></div>;

  return (
    <div className="rows">
      {playlist.tracks.map((t, i) => (
        <div key={t.id} className="row-wrap" draggable onDragStart={() => (dragFrom.current = i)} onDragOver={(e) => e.preventDefault()}
          onDrop={() => dragFrom.current !== null && reorderPlaylist(playlist.id, dragFrom.current, i)}>
          <span className="icon-btn grip" aria-hidden="true"><Icon name="grip" size={18} /></span>
          <div style={{ flex: 1, minWidth: 0 }}><TrackRow track={t} queue={playlist.tracks} rank={i + 1} noAdd /></div>
          <button className="icon-btn" onClick={() => removeFromPlaylist(playlist.id, t.id)} aria-label={tr("הסר מהפלייליסט")}><Icon name="close" size={18} /></button>
        </div>
      ))}
    </div>
  );
}
