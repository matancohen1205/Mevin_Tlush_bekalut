/** People the user follows who can still be invited. */
import type { Profile } from "../../types";
import { tr, useLang } from "../../i18n";
import { Avatar } from "../common/Avatar";

/** One row per friend with an Invite button. */
export function InvitePeopleList({ people, onInvite }: { people: Profile[]; onInvite: (id: string) => void }) {
  useLang();
  if (!people.length) return <p className="muted">{tr("אין עוד חברים להזמין. עקבו אחרי אנשים בקהילה.")}</p>;
  return (
    <div className="rows">
      {people.map((p) => (
        <div key={p.id} className="row">
          <Avatar user={p} size={40} />
          <span className="meta"><div className="t">{tr(p.name)}</div><div className="a">@{p.handle}</div></span>
          <button className="chip" onClick={() => onInvite(p.id)}>{tr("הזמן")}</button>
        </div>
      ))}
    </div>
  );
}
