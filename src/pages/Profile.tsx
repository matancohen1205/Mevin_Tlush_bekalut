import { useMemo } from "react";
import { Avatar } from "../components/Avatar";
import { Icon } from "../components/Icon";
import { PostCard } from "../components/PostCard";
import { useLibrary } from "../state/library";
import { usePlayer } from "../state/player";
import { LangSwitch } from "../components/LangSwitch";
import { useInstall } from "../state/install";
import { useAuth } from "../state/auth";
import { useSocial } from "../state/social";
import { useUi } from "../state/ui";
import type { Track } from "../types";
import { tr, useLang } from "../i18n";

function Stat({ n, label }: { n: number; label: string }) {
  return <div className="stat"><strong>{n.toLocaleString("he-IL")}</strong><span className="muted">{label}</span></div>;
}

function Mini({ title, tracks }: { title: string; tracks: Track[] }) {
  useLang();
  const { play } = usePlayer();
  return (
    <button className="card" onClick={() => tracks[0] && play(tracks[0], tracks)} aria-label={tr("נגן {title}", { title })}>
      <div className="mosaic art" style={{ width: 148, height: 148, borderRadius: 16 }}>{tracks.slice(0, 4).map((t, i) => <img key={i} src={t.artwork} alt="" />)}</div>
      <div className="t">{title}</div><div className="a">{tr("{n} שירים", { n: tracks.length })}</div>
    </button>
  );
}

export function Profile({ themeBtn }: { themeBtn: React.ReactNode }) {
  useLang();
  const soc = useSocial();
  const lib = useLibrary();
  const { setSheet, showToast } = useUi();
  const auth = useAuth();
  const { install, ios } = useInstall();
  const me = soc.me;
  const myPosts = soc.posts.filter((p) => p.authorId === "me");
  const artists = useMemo(() => {
    const c = new Map<string, number>();
    lib.liked.forEach((t) => c.set(t.artist, (c.get(t.artist) ?? 0) + 1));
    return [...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([a]) => a);
  }, [lib.liked]);
  const pub = lib.playlists.filter((p) => p.visibility === "public");

  return (
    <main className="page">
      <div className="topbar"><h1 className="page-title">{tr("פרופיל")}</h1>{themeBtn}</div>

      <section className="profile-head">
        <Avatar user={me} size={84} />
        <h2>{me.name}</h2>
        <span className="muted" dir="ltr">@{me.handle}{me.isPrivate && " · 🔒"}</span>
        {me.bio && <p>{me.bio}</p>}
        <div className="stats">
          <Stat n={soc.followersCount("me")} label={tr("עוקבים")} /><Stat n={soc.followingCount("me")} label={tr("עוקב")} /><Stat n={lib.playlists.length} label={tr("פלייליסטים")} />
        </div>
        <button className="chip" onClick={() => setSheet({ kind: "editProfile" })}><Icon name="edit" size={14} /> {tr("עריכת פרופיל")}</button>
      </section>

      {artists.length > 0 && (
        <section className="section"><div className="section-head"><h2>{tr("אמנים אהובים")}</h2></div>
          <div className="chip-row">{artists.map((a) => <span key={a} className="chip">{a}</span>)}</div></section>
      )}

      <section className="section">
        <div className="section-head"><h2>{tr("פלייליסטים ציבוריים")}</h2></div>
        {pub.length ? <div className="hscroll">{pub.map((p) => <Mini key={p.id} title={p.title} tracks={p.tracks} />)}</div>
          : <p className="muted">{tr("פלייליסט שתגדירו כציבורי יופיע כאן.")}</p>}
      </section>

      <section className="section">
        <div className="section-head"><h2>{tr("השיתופים שלי")}</h2></div>
        {myPosts.length ? <div className="feed">{myPosts.map((p) => <PostCard key={p.id} post={p} />)}</div> : <p className="muted">{tr("עוד לא שיתפתם כלום.")}</p>}
      </section>

      <section className="section settings">
        <div className="section-head"><h2>{tr("הגדרות ופרטיות")}</h2></div>
        <label className="switch-row">
          <span><strong>{tr("פרופיל פרטי")}</strong><span className="muted">{tr("רק עוקבים שאישרתם יראו את השיתופים שלכם")}</span></span>
          <input type="checkbox" role="switch" checked={me.isPrivate} onChange={(e) => soc.updateMe({ isPrivate: e.target.checked })} />
        </label>
        <div className="switch-row">
          <span><strong>{tr("משתמשים חסומים")}</strong><span className="muted">{soc.blocked.length ? "" : tr("אין משתמשים חסומים")}</span></span>
        </div>
        {soc.blocked.map((id) => {
          const u = soc.profileOf(id)!;
          return <div key={id} className="row"><Avatar user={u} size={36} /><span className="meta"><div className="t">{u.name}</div></span><button className="chip" onClick={() => soc.unblock(id)}>{tr("בטל חסימה")}</button></div>;
        })}
        <div className="switch-row">
          <span><strong>{tr("שפה")}</strong><span className="muted">{tr("עברית או English")}</span></span>
          <LangSwitch />
        </div>
        {(install || ios) && (
          <div className="switch-row">
            <span><strong>{tr("התקנת האפליקציה")}</strong><span className="muted">{install ? tr("הוסיפו את Wavely למסך הבית") : tr("בספארי: שיתוף ← הוספה למסך הבית")}</span></span>
            {install && <button className="chip" onClick={install}>{tr("התקנה")}</button>}
          </div>
        )}
        {auth.enabled && (
          <div className="switch-row">
            <span><strong>{tr("חשבון")}</strong><span className="muted" dir="ltr">{auth.email ?? tr("אורח – הנתונים רק במכשיר הזה")}</span></span>
            {auth.userId ? <button className="chip" onClick={auth.signOut}>{tr("התנתקות")}</button> : <button className="chip" onClick={auth.leaveGuest}>{tr("התחברות")}</button>}
          </div>
        )}
        <button className="chip danger" onClick={() => { soc.reset(); showToast("נתוני הקהילה אופסו"); }}>{tr("איפוס נתוני הדמו של הקהילה")}</button>
      </section>
    </main>
  );
}
