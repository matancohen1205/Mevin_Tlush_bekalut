import { useState } from "react";
import { Icon } from "../components/Icon";
import { PostCard } from "../components/PostCard";
import { Avatar } from "../components/Avatar";
import { useSocial } from "../state/social";
import { useUi } from "../state/ui";
import { SEED_USERS } from "../services/seed";

export function Community() {
  const soc = useSocial();
  const { setSheet, setRoute } = useUi();
  const [tab, setTab] = useState<"following" | "discover">("following");

  const visible = soc.posts.filter((p) => !soc.blocked.includes(p.authorId));
  const feed = tab === "following"
    ? visible.filter((p) => p.authorId === "me" || soc.following[p.authorId] === "accepted")
    : visible.filter((p) => p.authorId === "me" || !soc.profileOf(p.authorId)?.isPrivate || soc.following[p.authorId] === "accepted");
  const suggestions = SEED_USERS.filter((u) => !soc.following[u.id] && !soc.blocked.includes(u.id));

  return (
    <main className="page">
      <div className="topbar">
        <h1 className="page-title">קהילה</h1>
        <div className="topbar-actions">
          <button className="icon-btn bell" onClick={() => setRoute({ kind: "notifs" })} aria-label={`התראות${soc.unread ? `, ${soc.unread} חדשות` : ""}`}>
            <Icon name="bell" />{soc.unread > 0 && <span className="badge">{soc.unread}</span>}
          </button>
          <button className="btn primary" onClick={() => setSheet({ kind: "compose" })}><Icon name="plus" size={18} /> שתף</button>
        </div>
      </div>

      <div className="seg" role="tablist" style={{ marginTop: 16 }}>
        <button role="tab" aria-selected={tab === "following"} onClick={() => setTab("following")}>עוקבים</button>
        <button role="tab" aria-selected={tab === "discover"} onClick={() => setTab("discover")}>גלו</button>
      </div>

      {tab === "following" && suggestions.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>אנשים שאולי תאהבו</h2></div>
          <div className="hscroll">
            {suggestions.map((u) => (
              <div key={u.id} className="person">
                <button onClick={() => setRoute({ kind: "user", id: u.id })} className="person-link"><Avatar user={u} size={56} /><strong>{u.name}</strong><span className="muted">@{u.handle}</span></button>
                <button className="chip" onClick={() => soc.toggleFollow(u.id)}>{soc.following[u.id] ? "בקשה נשלחה" : "עקוב"}</button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section feed">
        {feed.length ? feed.map((p) => <PostCard key={p.id} post={p} />) : (
          <div className="empty"><div className="big">🌊</div><p>עוד אין מה להציג. עקבו אחרי אנשים או שתפו שיר ראשון.</p></div>
        )}
      </section>
    </main>
  );
}
