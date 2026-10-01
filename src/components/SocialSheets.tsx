import { useState, type ReactNode } from "react";
import { useLibrary } from "../state/library";
import { usePlayer } from "../state/player";
import { useSocial } from "../state/social";
import { useUi } from "../state/ui";
import type { Track } from "../types";
import { Avatar, timeAgo } from "./Avatar";
import { Icon } from "./Icon";
import { tr, useLang } from "../i18n";

export function Modal({ title, children }: { title: string; children: ReactNode }) {
  useLang();
  const { setSheet } = useUi();
  return (
    <div className="overlay" onClick={() => setSheet(null)}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={() => setSheet(null)} aria-label={tr("סגור")}><Icon name="close" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function CommentsSheet({ postId }: { postId: string }) {
  useLang();
  const soc = useSocial();
  const [body, setBody] = useState("");
  const post = soc.posts.find((p) => p.id === postId);
  if (!post) return null;
  return (
    <Modal title={tr("תגובות")}>
      <div className="comments">
        {post.comments.length === 0 && <p className="muted">{tr("עוד אין תגובות. אפשר להיות הראשונים.")}</p>}
        {post.comments.map((c) => {
          const a = soc.profileOf(c.authorId);
          return a && (
            <div key={c.id} className="comment">
              <Avatar user={a} size={34} />
              <div><strong>{tr(a.name)}</strong> <span className="muted">{timeAgo(c.createdAt)}</span><p>{tr(c.body)}</p></div>
            </div>
          );
        })}
      </div>
      <form className="inline-form" onSubmit={(e) => { e.preventDefault(); if (body.trim()) { soc.addComment(postId, body.trim()); setBody(""); } }}>
        <input className="input" value={body} onChange={(e) => setBody(e.target.value)} placeholder={tr("כתבו תגובה…")} aria-label={tr("תגובה")} />
        <button className="btn primary" disabled={!body.trim()}>{tr("שלח")}</button>
      </form>
    </Modal>
  );
}

export function ComposeSheet() {
  useLang();
  const soc = useSocial();
  const lib = useLibrary();
  const { current } = usePlayer();
  const { setSheet, showToast } = useUi();
  const [kind, setKind] = useState<"track" | "playlist">(current ? "track" : lib.playlists.length ? "playlist" : "track");
  const [track, setTrack] = useState<Track | null>(current);
  const [plId, setPlId] = useState<string | null>(lib.playlists[0]?.id ?? null);
  const [caption, setCaption] = useState("");

  const options: Track[] = [...(current ? [current] : []), ...lib.liked.filter((t) => t.id !== current?.id)].slice(0, 12);
  const pl = lib.playlists.find((p) => p.id === plId);
  const ready = kind === "track" ? !!track : !!pl && pl.tracks.length > 0;

  const publish = () => {
    if (kind === "track" && track) soc.createPost({ kind: track.id === current?.id && !caption.trim() ? "now_playing" : "track", caption: caption.trim(), track });
    else if (pl) soc.createPost({ kind: "playlist", caption: caption.trim(), playlist: { title: pl.title, description: pl.description, tracks: pl.tracks } });
    showToast("השיתוף פורסם");
    setSheet(null);
  };

  return (
    <Modal title={tr("שיתוף בקהילה")}>
      <div className="seg" role="tablist">
        <button role="tab" aria-selected={kind === "track"} onClick={() => setKind("track")}>{tr("שיר")}</button>
        <button role="tab" aria-selected={kind === "playlist"} onClick={() => setKind("playlist")}>{tr("פלייליסט")}</button>
      </div>

      {kind === "track" ? (
        options.length ? (
          <div className="rows" style={{ marginTop: 12 }}>
            {options.map((t) => (
              <button key={t.id} className="row" data-active={track?.id === t.id} onClick={() => setTrack(t)}>
                <img className="art" src={t.artwork} alt="" />
                <span className="meta"><div className="t">{t.title}</div><div className="a">{t.artist}{t.id === current?.id ? ` · ${tr("מתנגן עכשיו")}` : ""}</div></span>
                {track?.id === t.id && <Icon name="check" />}
              </button>
            ))}
          </div>
        ) : <p className="muted" style={{ marginTop: 12 }}>{tr("נגנו שיר או סמנו שירים באהבתי כדי לשתף אותם.")}</p>
      ) : lib.playlists.length ? (
        <div className="rows" style={{ marginTop: 12 }}>
          {lib.playlists.map((p) => (
            <button key={p.id} className="row" data-active={plId === p.id} onClick={() => setPlId(p.id)}>
              <span className="meta"><div className="t">{p.title}</div><div className="a">{tr("{n} שירים", { n: p.tracks.length })}</div></span>
              {plId === p.id && <Icon name="check" />}
            </button>
          ))}
        </div>
      ) : <p className="muted" style={{ marginTop: 12 }}>{tr("עוד אין לכם פלייליסטים. צרו אחד בספרייה.")}</p>}

      <label className="lbl" htmlFor="cap">{tr("מה תרצו להגיד?")}</label>
      <textarea id="cap" className="input" rows={2} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder={tr("הוסיפו כמה מילים (לא חובה)")} />
      <button className="btn primary wide" disabled={!ready} onClick={publish}>{tr("פרסם")}</button>
    </Modal>
  );
}

export function EditProfileSheet() {
  useLang();
  const soc = useSocial();
  const { setSheet, showToast } = useUi();
  const [name, setName] = useState(soc.me.name);
  const [handle, setHandle] = useState(soc.me.handle);
  const [bio, setBio] = useState(soc.me.bio);
  const clean = handle.trim().replace(/[^a-zA-Z0-9._]/g, "");
  return (
    <Modal title={tr("עריכת פרופיל")}>
      <label className="lbl" htmlFor="pn">{tr("שם")}</label>
      <input id="pn" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={30} />
      <label className="lbl" htmlFor="ph">{tr("שם משתמש (אותיות באנגלית, ספרות, נקודה וקו תחתון)")}</label>
      <input id="ph" className="input" dir="ltr" value={handle} onChange={(e) => setHandle(e.target.value)} maxLength={20} />
      <label className="lbl" htmlFor="pb">{tr("ביו")}</label>
      <textarea id="pb" className="input" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={140} />
      <button className="btn primary wide" disabled={!name.trim() || !clean} onClick={() => { soc.updateMe({ name: name.trim(), handle: clean, bio: bio.trim() }); showToast("הפרופיל עודכן"); setSheet(null); }}>{tr("שמור")}</button>
    </Modal>
  );
}

export function MoreSheet({ postId, userId }: { postId?: string; userId: string }) {
  useLang();
  const soc = useSocial();
  const { setSheet, showToast } = useUi();
  const [step, setStep] = useState<"menu" | "report" | "block">("menu");
  const user = soc.profileOf(userId);
  const mine = userId === "me";
  const done = (m: string) => { showToast(m); setSheet(null); };
  if (!user) return null;

  if (step === "report")
    return (
      <Modal title={tr("דיווח")}>
        <p className="muted">{tr("למה אתם מדווחים?")}</p>
        <div className="rows" style={{ marginTop: 8 }}>
          {["ספאם", "תוכן פוגעני", "הטרדה", "אחר"].map((r) => <button key={r} className="row" onClick={() => done(tr("הדיווח התקבל, תודה"))}>{tr(r)}</button>)}
        </div>
      </Modal>
    );
  if (step === "block")
    return (
      <Modal title={tr("לחסום את {name}?", { name: tr(user.name) })}>
        <p className="muted">{tr("לא תראו יותר תוכן ממנו/ה, והוא/היא לא יוכלו לעקוב אחריכם. אפשר לבטל בהגדרות הפרטיות.")}</p>
        <button className="btn primary wide" onClick={() => { soc.block(userId); done(tr("{name} נחסם/ה", { name: tr(user.name) })); }}>{tr("חסום")}</button>
      </Modal>
    );
  return (
    <Modal title={tr("עוד פעולות")}>
      <div className="rows">
        {mine && postId && <button className="row" onClick={() => { soc.deletePost(postId); done(tr("השיתוף נמחק")); }}><Icon name="trash" /> {tr("מחק שיתוף")}</button>}
        {!mine && <button className="row" onClick={() => setStep("report")}><Icon name="flag" /> {tr("דווח")}</button>}
        {!mine && <button className="row" onClick={() => setStep("block")}><Icon name="close" /> {tr("חסום את {name}", { name: tr(user.name) })}</button>}
      </div>
    </Modal>
  );
}
