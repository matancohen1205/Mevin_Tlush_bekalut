/** A playlist attached to a post: mosaic, title and a play button. */
import { usePlayer } from "../../state/player";
import type { SharedPlaylist } from "../../types";
import { tr, useLang, trn } from "../../i18n";
import { Icon } from "../common/Icon";

/** Playing starts the playlist from its first track. */
export function PlaylistAttachment({ playlist }: { playlist: SharedPlaylist }) {
  useLang();
  const { play } = usePlayer();
  return (
    <div className="attach pl">
      <div className="mosaic" style={{ width: 64, height: 64 }}>{playlist.tracks.slice(0, 4).map((t, i) => <img key={i} src={t.artwork} alt="" />)}</div>
      <span className="meta"><span className="t">{tr(playlist.title)}</span><span className="a">{trn("{n} שירים", playlist.tracks.length)}</span></span>
      <button className="play-fab sm" onClick={() => play(playlist.tracks[0], playlist.tracks)} aria-label={tr("נגן את הפלייליסט")}><Icon name="play" size={18} /></button>
    </div>
  );
}
