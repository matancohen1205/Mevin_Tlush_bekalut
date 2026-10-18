/** Bell button with an unread badge; opens the notifications page. */
import { useSocial } from "../../state/social";
import { useUi } from "../../state/ui";
import { tr, useLang } from "../../i18n";
import { Icon } from "../common/Icon";

/** Header action of the community page. */
export function NotificationBell() {
  useLang();
  const { unread } = useSocial();
  const { setRoute } = useUi();
  return (
    <button className="icon-btn bell" onClick={() => setRoute({ kind: "notifs" })} aria-label={unread ? tr("התראות, {n} חדשות", { n: unread }) : tr("התראות")}>
      <Icon name="bell" />{unread > 0 && <span className="badge">{unread}</span>}
    </button>
  );
}
