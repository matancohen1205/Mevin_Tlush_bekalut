/** Button that shares a playlist as a link. */
import type { Playlist } from "../../types";
import { tr, useLang } from "../../i18n";
import { useShareLink } from "../../state/collab";
import { Icon } from "../common/Icon";

/** Icon button; the share logic lives in useShareLink. */
export function ShareButton({ playlist }: { playlist: Playlist }) {
  useLang();
  const share = useShareLink(playlist);
  return <button className="icon-btn" onClick={share} disabled={!playlist.tracks.length} aria-label={tr("שתף קישור")}><Icon name="link" /></button>;
}
