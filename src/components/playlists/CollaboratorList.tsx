/** People already invited to a playlist, each with a remove button. */
import { tr, useLang } from "../../i18n";
import { useSocial } from "../../state/social";
import { Avatar } from "../common/Avatar";
import { Icon } from "../common/Icon";

/** Rows for `userIds`; `onRemove` is called with the person's id. */
export function CollaboratorList({ userIds, onRemove }: { userIds: string[]; onRemove: (id: string) => void }) {
  useLang();
  const { profileOf } = useSocial();
  if (!userIds.length) return <p className="muted">{tr("עוד לא הזמנתם אף אחד.")}</p>;
  return (
    <div className="rows">
      {userIds.map((id) => {
        const person = profileOf(id);
        return person && (
          <div key={id} className="row">
            <Avatar user={person} size={40} />
            <span className="meta"><div className="t">{tr(person.name)}</div><div className="a">@{person.handle}</div></span>
            <button className="icon-btn" onClick={() => onRemove(id)} aria-label={tr("הסר את {name}", { name: tr(person.name) })}><Icon name="close" size={18} /></button>
          </div>
        );
      })}
    </div>
  );
}
