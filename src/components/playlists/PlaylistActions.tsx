/** Play, visibility, edit and delete buttons of a playlist page. */
import { usePlayer } from "../../state/player";
import type { usePlaylistEditor } from "../../state/library";
import type { Playlist } from "../../types";
import { tr, useLang } from "../../i18n";
import { useUi } from "../../state/ui";
import { Icon } from "../common/Icon";
import { ShareButton } from "./ShareButton";

/** Action row. */
export function PlaylistActions({ playlist, editor }: { playlist: Playlist; editor: ReturnType<typeof usePlaylistEditor> }) {
  useLang();
  const { play } = usePlayer();
  const { setSheet } = useUi();
  const isPublic = playlist.visibility === "public";
  return (
    <div className="actions">
      <button className="btn primary" disabled={!playlist.tracks.length} onClick={() => play(playlist.tracks[0], playlist.tracks)}><Icon name="play" size={18} /> {tr("נגן")}</button>
      <button className="chip" onClick={editor.toggleVisibility} aria-pressed={isPublic}>
        <Icon name={isPublic ? "globe" : "lock"} size={14} /> {isPublic ? tr("ציבורי") : tr("פרטי")}
      </button>
      <button className="icon-btn" onClick={() => setSheet({ kind: "collab", playlistId: playlist.id })} aria-label={tr("פלייליסט שיתופי")}><Icon name="userplus" /></button>
      <ShareButton playlist={playlist} />
      <button className="icon-btn" onClick={editor.toggleEditing} aria-label={tr("עריכה")}><Icon name="edit" /></button>
      <button className="icon-btn" onClick={editor.remove} aria-label={tr("מחיקה")}><Icon name="trash" /></button>
    </div>
  );
}
