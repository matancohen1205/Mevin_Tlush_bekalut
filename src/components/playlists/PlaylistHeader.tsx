/** Playlist page header: cover plus title/description (or the edit fields). */
import type { Playlist } from "../../types";
import { tr, useLang } from "../../i18n";
import type { usePlaylistEditor } from "../../state/library";
import { PlaylistCover } from "./PlaylistCover";

type Editor = ReturnType<typeof usePlaylistEditor>;

/** Shows read-only info, or inputs while `editor.editing`. */
export function PlaylistHeader({ playlist, editor }: { playlist: Playlist; editor: Editor }) {
  useLang();
  return (
    <div className="pl-head">
      <PlaylistCover tracks={playlist.tracks} size={120} />
      {editor.editing ? (
        <div style={{ flex: 1 }}>
          <input className="input" value={editor.title} onChange={(e) => editor.setTitle(e.target.value)} aria-label={tr("שם הפלייליסט")} />
          <textarea className="input" rows={2} value={editor.description} onChange={(e) => editor.setDescription(e.target.value)} aria-label={tr("תיאור")} style={{ marginTop: 8 }} />
          <button className="btn primary" style={{ marginTop: 8 }} onClick={editor.save}>{tr("שמור")}</button>
        </div>
      ) : (
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className="page-title" style={{ fontSize: 24 }}>{playlist.title}</h1>
          {playlist.description && <p className="muted">{playlist.description}</p>}
          <p className="muted">{tr("{n} שירים", { n: playlist.tracks.length })}</p>
        </div>
      )}
    </div>
  );
}
