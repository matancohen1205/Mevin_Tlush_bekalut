/** The "liked songs" list with its empty state. */
import type { Track } from "../../types";
import { tr, useLang } from "../../i18n";
import { TrackRow } from "../tracks";

/** Rows for the liked tracks. */
export function LikedSongs({ liked }: { liked: Track[] }) {
  useLang();
  if (!liked.length) return <div className="empty"><div className="big">💙</div><p>{tr("לחצו על הלב ליד שיר כדי לשמור אותו כאן.")}</p></div>;
  return <div className="rows">{liked.map((t) => <TrackRow key={t.id} track={t} queue={liked} />)}</div>;
}
