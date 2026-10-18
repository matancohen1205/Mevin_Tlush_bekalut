/** The user's playlists as rows; selecting one opens it. */
import type { Playlist } from "../../types";
import { tr, useLang } from "../../i18n";
import { PlaylistCover } from "./PlaylistCover";

/** Empty state included. */
export function PlaylistList({ playlists, onOpen }: { playlists: Playlist[]; onOpen: (id: string) => void }) {
  useLang();
  if (!playlists.length) return <div className="empty"><div className="big">🎧</div><p>{tr("עוד אין פלייליסטים. צרו אחד ידנית או תנו ל-AI להרכיב לכם.")}</p></div>;
  return (
    <div className="rows">
      {playlists.map((p) => (
        <button key={p.id} className="row" onClick={() => onOpen(p.id)}>
          <PlaylistCover tracks={p.tracks} />
          <span className="meta">
            <div className="t">{p.title}</div>
            <div className="a">{tr("{n} שירים", { n: p.tracks.length })} · {p.visibility === "public" ? tr("ציבורי") : tr("פרטי")}</div>
          </span>
        </button>
      ))}
    </div>
  );
}
