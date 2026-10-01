import { useEffect } from "react";
import { Avatar, timeAgo } from "../components/Avatar";
import { Icon } from "../components/Icon";
import { useSocial } from "../state/social";
import { useUi } from "../state/ui";
import { tr, useLang } from "../i18n";

const TEXT = { follow: "התחיל/ה לעקוב אחריך", like: "אהב/ה את השיתוף שלך", comment: "הגיב/ה על השיתוף שלך", accepted: "אישר/ה את בקשת המעקב שלך" } as const;

export function Notifications() {
  useLang();
  const soc = useSocial();
  const { setRoute, setSheet } = useUi();
  // mark as read after the user had a moment to see which are new
  useEffect(() => {
    const id = setTimeout(soc.markRead, 1500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="page">
      <button className="icon-btn" onClick={() => setRoute(null)} aria-label={tr("חזרה")}><Icon name="back" /></button>
      <h1 className="page-title">{tr("התראות")}</h1>
      <section className="section">
        {soc.notifs.length ? (
          <div className="rows">
            {soc.notifs.filter((n) => !soc.blocked.includes(n.actorId)).map((n) => {
              const a = soc.profileOf(n.actorId)!;
              return (
                <button key={n.id} className={`row ${n.read ? "" : "unread"}`}
                  onClick={() => n.type === "comment" && n.postId ? setSheet({ kind: "comments", postId: n.postId }) : (setRoute({ kind: "user", id: n.actorId }))}>
                  <Avatar user={a} />
                  <span className="meta"><div className="t">{tr(a.name)} {tr(TEXT[n.type])}</div><div className="a">{timeAgo(n.createdAt)}</div></span>
                </button>
              );
            })}
          </div>
        ) : <div className="empty"><div className="big">🔔</div><p>{tr("אין התראות חדשות.")}</p></div>}
      </section>
    </main>
  );
}
