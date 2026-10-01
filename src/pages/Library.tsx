import { useRef, useState } from "react";
import { useLibrary } from "../state/library";
import { usePlayer } from "../state/player";
import { useUi } from "../state/ui";
import { Icon } from "../components/Icon";
import { TrackRow } from "../components/Track";
import type { Playlist } from "../types";
import { tr, useLang } from "../i18n";

function Cover({ tracks, size = 56 }: { tracks: { artwork: string }[]; size?: number }) {
  const four = tracks.slice(0, 4);
  return (
    <div className="mosaic" style={{ width: size, height: size }}>
      {four.length ? four.map((t, i) => <img key={i} src={t.artwork} alt="" style={four.length < 4 ? { gridColumn: "1 / -1", gridRow: "1 / -1" } : undefined} hidden={four.length < 4 && i > 0} />) : <span><Icon name="library" size={size / 2.4} /></span>}
    </div>
  );
}

export function Library() {
  useLang();
  const { liked, playlists } = useLibrary();
  const { setSheet } = useUi();
  const [openId, setOpenId] = useState<string | null>(null);
  const open = playlists.find((p) => p.id === openId);
  if (open) return <PlaylistView playlist={open} onBack={() => setOpenId(null)} />;

  return (
    <main className="page">
      <div className="topbar">
        <h1 className="page-title">{tr("הספרייה שלי")}</h1>
        <button className="btn primary" onClick={() => setSheet({ kind: "new" })}><Icon name="plus" size={18} /> {tr("חדש")}</button>
      </div>

      <section className="section">
        <div className="section-head"><h2>{tr("פלייליסטים")}</h2><span className="muted">{playlists.length}</span></div>
        {playlists.length ? (
          <div className="rows">
            {playlists.map((p) => (
              <button key={p.id} className="row" onClick={() => setOpenId(p.id)}>
                <Cover tracks={p.tracks} />
                <span className="meta">
                  <div className="t">{p.title}</div>
                  <div className="a">{tr("{n} שירים", { n: p.tracks.length })} · {p.visibility === "public" ? tr("ציבורי") : tr("פרטי")}</div>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty"><div className="big">🎧</div><p>{tr("עוד אין פלייליסטים. צרו אחד ידנית או תנו ל-AI להרכיב לכם.")}</p></div>
        )}
      </section>

      <section className="section">
        <div className="section-head"><h2>{tr("שירים שאהבתי")}</h2><span className="muted">{liked.length}</span></div>
        {liked.length ? (
          <div className="rows">{liked.map((t) => <TrackRow key={t.id} track={t} queue={liked} />)}</div>
        ) : (
          <div className="empty"><div className="big">💙</div><p>{tr("לחצו על הלב ליד שיר כדי לשמור אותו כאן.")}</p></div>
        )}
      </section>
    </main>
  );
}

function PlaylistView({ playlist: p, onBack }: { playlist: Playlist; onBack: () => void }) {
  useLang();
  const lib = useLibrary();
  const { play } = usePlayer();
  const { showToast } = useUi();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(p.title);
  const [desc, setDesc] = useState(p.description);
  const from = useRef<number | null>(null);

  const save = () => { lib.updatePlaylist(p.id, { title: title.trim() || p.title, description: desc }); setEditing(false); };
  const del = () => {
    if (confirm(tr("למחוק את ״{title}״?", { title: p.title }))) { lib.deletePlaylist(p.id); showToast(tr("הפלייליסט נמחק")); onBack(); }
  };

  return (
    <main className="page">
      <button className="icon-btn" onClick={onBack} aria-label={tr("חזרה")}><Icon name="back" /></button>
      <div className="pl-head">
        <Cover tracks={p.tracks} size={120} />
        {editing ? (
          <div style={{ flex: 1 }}>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} aria-label={tr("שם הפלייליסט")} />
            <textarea className="input" rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} aria-label={tr("תיאור")} style={{ marginTop: 8 }} />
            <button className="btn primary" style={{ marginTop: 8 }} onClick={save}>{tr("שמור")}</button>
          </div>
        ) : (
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="page-title" style={{ fontSize: 24 }}>{p.title}</h1>
            {p.description && <p className="muted">{p.description}</p>}
            <p className="muted">{tr("{n} שירים", { n: p.tracks.length })}</p>
          </div>
        )}
      </div>

      <div className="actions">
        <button className="btn primary" disabled={!p.tracks.length} onClick={() => play(p.tracks[0], p.tracks)}><Icon name="play" size={18} /> {tr("נגן")}</button>
        <button className="chip" onClick={() => lib.updatePlaylist(p.id, { visibility: p.visibility === "public" ? "private" : "public" })} aria-pressed={p.visibility === "public"}>
          <Icon name={p.visibility === "public" ? "globe" : "lock"} size={14} /> {p.visibility === "public" ? tr("ציבורי") : tr("פרטי")}
        </button>
        <button className="icon-btn" onClick={() => setEditing(!editing)} aria-label={tr("עריכה")}><Icon name="edit" /></button>
        <button className="icon-btn" onClick={del} aria-label={tr("מחיקה")}><Icon name="trash" /></button>
      </div>

      <section className="section">
        {p.tracks.length ? (
          <div className="rows">
            {p.tracks.map((t, i) => (
              <div key={t.id} className="row-wrap" draggable onDragStart={() => (from.current = i)} onDragOver={(e) => e.preventDefault()} onDrop={() => from.current !== null && lib.reorderPlaylist(p.id, from.current, i)}>
                <span className="icon-btn grip" aria-hidden="true"><Icon name="grip" size={18} /></span>
                <div style={{ flex: 1, minWidth: 0 }}><TrackRow track={t} queue={p.tracks} rank={i + 1} noAdd /></div>
                <button className="icon-btn" onClick={() => lib.removeFromPlaylist(p.id, t.id)} aria-label={tr("הסר מהפלייליסט")}><Icon name="close" size={18} /></button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty"><div className="big">➕</div><p>{tr("הפלייליסט ריק. לחצו על + ליד שיר כדי להוסיף.")}</p></div>
        )}
      </section>
    </main>
  );
}
