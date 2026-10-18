/** One notification line: who did what, and when. */
import { relativeTime } from "../../domain/time";
import { locale, tr, useLang } from "../../i18n";
import type { Notif, Profile } from "../../types";
import { Avatar } from "../common/Avatar";

const TEXT = {
  follow: "התחיל/ה לעקוב אחריך",
  like: "אהב/ה את השיתוף שלך",
  comment: "הגיב/ה על השיתוף שלך",
  accepted: "אישר/ה את בקשת המעקב שלך",
} as const;

/** Unread rows are highlighted; `onOpen` handles the tap. */
export function NotificationRow({ notif, actor, onOpen }: { notif: Notif; actor: Profile; onOpen: () => void }) {
  useLang();
  return (
    <button className={`row ${notif.read ? "" : "unread"}`} onClick={onOpen}>
      <Avatar user={actor} />
      <span className="meta"><div className="t">{tr(actor.name)} {tr(TEXT[notif.type])}</div><div className="a">{relativeTime(notif.createdAt, locale())}</div></span>
    </button>
  );
}
