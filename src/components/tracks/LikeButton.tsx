/** Heart toggle that adds/removes a track from the user's liked songs. */
import { useLibrary } from "../../state/library";
import type { Track } from "../../types";
import { tr, useLang } from "../../i18n";
import { Icon } from "../common/Icon";

/** Heart button bound to the library; `size` scales the icon. */
export function LikeButton({ track, size = 24 }: { track: Track; size?: number }) {
  useLang();
  const { isLiked, toggleLike } = useLibrary();
  const liked = isLiked(track.id);
  return (
    <button className={`icon-btn ${liked ? "on" : ""}`} onClick={() => toggleLike(track)} aria-pressed={liked} aria-label={liked ? tr("הסר מאהובים") : tr("הוסף לאהובים")}>
      <Icon name="heart" size={size} fill={liked} />
    </button>
  );
}
