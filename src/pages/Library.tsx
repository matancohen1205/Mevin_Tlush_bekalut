/** Library screen: the user's playlists and liked songs; opening a playlist shows its page. */
import { useState } from "react";
import { Icon } from "../components/common/Icon";
import { LikedSongs } from "../components/playlists/LikedSongs";
import { PlaylistList } from "../components/playlists/PlaylistList";
import { PlaylistView } from "../components/playlists/PlaylistView";
import { useLibrary } from "../state/library";
import { useUi } from "../state/ui";
import { tr, useLang } from "../i18n";

/** Page composition only. */
export function Library() {
  useLang();
  const { liked, playlists } = useLibrary();
  const { setSheet } = useUi();
  const [openId, setOpenId] = useState<string | null>(null);
  const open = playlists.find((p) => p.id === openId);
  if (open) return <PlaylistView playlist={open} onBack={() => setOpenId(null)} />;

  return (
    <main id="main" tabIndex={-1} className="page">
      <div className="topbar">
        <h1 className="page-title">{tr("הספרייה שלי")}</h1>
        <button className="btn primary" onClick={() => setSheet({ kind: "new" })}><Icon name="plus" size={18} /> {tr("חדש")}</button>
      </div>
      <section className="section">
        <div className="section-head"><h2>{tr("פלייליסטים")}</h2><span className="muted">{playlists.length}</span></div>
        <PlaylistList playlists={playlists} onOpen={setOpenId} />
      </section>
      <section className="section">
        <div className="section-head"><h2>{tr("שירים שאהבתי")}</h2><span className="muted">{liked.length}</span></div>
        <LikedSongs liked={liked} />
      </section>
    </main>
  );
}
