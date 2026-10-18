/** "People you may like" carousel with follow buttons. */
import type { Profile } from "../../types";
import { tr, useLang } from "../../i18n";
import { useSocial } from "../../state/social";
import { useUi } from "../../state/ui";
import { Avatar } from "../common/Avatar";

/** Hidden when there is nobody to suggest. */
export function PeopleSuggestions({ people }: { people: Profile[] }) {
  useLang();
  const { following, toggleFollow } = useSocial();
  const { setRoute } = useUi();
  if (!people.length) return null;
  return (
    <section className="section">
      <div className="section-head"><h2>{tr("אנשים שאולי תאהבו")}</h2></div>
      <div className="hscroll">
        {people.map((u) => (
          <div key={u.id} className="person">
            <button onClick={() => setRoute({ kind: "user", id: u.id })} className="person-link"><Avatar user={u} size={56} /><strong>{tr(u.name)}</strong><span className="muted">@{u.handle}</span></button>
            <button className="chip" onClick={() => toggleFollow(u.id)}>{following[u.id] ? tr("בקשה נשלחה") : tr("עקוב")}</button>
          </div>
        ))}
      </div>
    </section>
  );
}
