/** Notifications screen. Everything is marked read shortly after it opens. */
import { useEffect } from "react";
import { Icon } from "../components/common/Icon";
import { NotificationRow } from "../components/social/NotificationRow";
import { useSocial } from "../state/social";
import { useUi } from "../state/ui";
import { tr, useLang } from "../i18n";

const MARK_READ_AFTER_MS = 1500;

/** Page composition only. */
export function Notifications() {
  useLang();
  const { notifs, blocked, profileOf, markRead } = useSocial();
  const { setRoute, setSheet } = useUi();

  // give the user a moment to see which items are new before clearing the badge
  useEffect(() => {
    const timer = setTimeout(markRead, MARK_READ_AFTER_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = notifs.filter((n) => !blocked.includes(n.actorId));
  return (
    <main id="main" tabIndex={-1} className="page">
      <button className="icon-btn" onClick={() => setRoute(null)} aria-label={tr("חזור")}><Icon name="back" /></button>
      <h1 className="page-title">{tr("התראות")}</h1>
      <section className="section">
        {visible.length ? (
          <div className="rows">
            {visible.map((n) => {
              const actor = profileOf(n.actorId);
              if (!actor) return null;
              const open = () => (n.type === "comment" && n.postId ? setSheet({ kind: "comments", postId: n.postId }) : setRoute({ kind: "user", id: n.actorId }));
              return <NotificationRow key={n.id} notif={n} actor={actor} onOpen={open} />;
            })}
          </div>
        ) : <div className="empty"><div className="big">🔔</div><p>{tr("אין התראות חדשות.")}</p></div>}
      </section>
    </main>
  );
}
