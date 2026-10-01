import { Avatar } from "../components/Avatar";
import { Icon } from "../components/Icon";
import { PostCard } from "../components/PostCard";
import { usePlayer } from "../state/player";
import { useSocial } from "../state/social";
import { useUi } from "../state/ui";
import { tr, useLang } from "../i18n";

export function UserProfile({ id }: { id: string }) {
  useLang();
  const soc = useSocial();
  const { play } = usePlayer();
  const { setRoute, setSheet } = useUi();
  const u = soc.profileOf(id);
  if (!u) return null;
  const status = soc.following[id];
  const visible = soc.canSee(id);
  const posts = soc.posts.filter((p) => p.authorId === id);
  const playlists = soc.playlistsOf(id);
  const blocked = soc.blocked.includes(id);

  return (
    <main id="main" tabIndex={-1} className="page">
      <div className="topbar">
        <button className="icon-btn" onClick={() => setRoute(null)} aria-label={tr("חזרה")}><Icon name="back" /></button>
        <button className="icon-btn" onClick={() => setSheet({ kind: "more", userId: id })} aria-label={tr("עוד פעולות")}><Icon name="more" /></button>
      </div>

      <section className="profile-head">
        <Avatar user={u} size={84} />
        <h2>{tr(u.name)}</h2>
        <span className="muted" dir="ltr">@{u.handle}{u.isPrivate && " · 🔒"}</span>
        {u.bio && <p>{tr(u.bio)}</p>}
        <div className="stats">
          <div className="stat"><strong>{soc.followersCount(id).toLocaleString("he-IL")}</strong><span className="muted">{tr("עוקבים")}</span></div>
          <div className="stat"><strong>{soc.followingCount(id)}</strong><span className="muted">{tr("עוקב")}</span></div>
          <div className="stat"><strong>{playlists.length}</strong><span className="muted">{tr("פלייליסטים")}</span></div>
        </div>
        {blocked ? <button className="btn primary" onClick={() => soc.unblock(id)}>{tr("בטל חסימה")}</button> : (
          <button className={status ? "chip" : "btn primary"} onClick={() => soc.toggleFollow(id)} aria-pressed={!!status}>
            {status === "accepted" ? tr("עוקב ✓") : status === "pending" ? tr("בקשה נשלחה") : <><Icon name="userplus" size={18} /> {tr("עקוב")}</>}
          </button>
        )}
      </section>

      {blocked ? null : !visible ? (
        <div className="empty"><div className="big">🔒</div><p>{tr("הפרופיל פרטי. עקבו כדי לראות את השיתופים והפלייליסטים.")}</p></div>
      ) : (
        <>
          {playlists.length > 0 && (
            <section className="section"><div className="section-head"><h2>{tr("פלייליסטים")}</h2></div>
              <div className="hscroll">{playlists.map((p) => (
                <button key={p.title} className="card" onClick={() => play(p.tracks[0], p.tracks)}>
                  <div className="mosaic art" style={{ width: 148, height: 148, borderRadius: 16 }}>{p.tracks.slice(0, 4).map((t, i) => <img key={i} src={t.artwork} alt="" />)}</div>
                  <div className="t">{tr(p.title)}</div><div className="a">{tr("{n} שירים", { n: p.tracks.length })}</div>
                </button>))}
              </div></section>
          )}
          <section className="section"><div className="section-head"><h2>{tr("שיתופים")}</h2></div>
            {posts.length ? <div className="feed">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div> : <p className="muted">{tr("עוד אין שיתופים.")}</p>}
          </section>
        </>
      )}
    </main>
  );
}
