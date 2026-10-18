/** One playlist's page: header, actions and tracks. */
import { usePlaylistEditor } from "../../state/library";
import type { Playlist } from "../../types";
import { tr, useLang } from "../../i18n";
import { Icon } from "../common/Icon";
import { PlaylistActions } from "./PlaylistActions";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistTracks } from "./PlaylistTracks";

/** `onBack` returns to the library list. */
export function PlaylistView({ playlist, onBack }: { playlist: Playlist; onBack: () => void }) {
  useLang();
  const editor = usePlaylistEditor(playlist, onBack);
  return (
    <main id="main" tabIndex={-1} className="page">
      <button className="icon-btn" onClick={onBack} aria-label={tr("חזור")}><Icon name="back" /></button>
      <PlaylistHeader playlist={playlist} editor={editor} />
      <PlaylistActions playlist={playlist} editor={editor} />
      <section className="section"><PlaylistTracks playlist={playlist} /></section>
    </main>
  );
}
