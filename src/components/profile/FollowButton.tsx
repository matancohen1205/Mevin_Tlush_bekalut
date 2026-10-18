/** Follow / request sent / following button for another user's profile. */
import type { FollowStatus } from "../../types";
import { tr, useLang } from "../../i18n";
import { Icon } from "../common/Icon";

/** Shows the current follow state; clicking toggles it. */
export function FollowButton({ status, onToggle }: { status: FollowStatus | undefined; onToggle: () => void }) {
  useLang();
  return (
    <button className={status ? "chip" : "btn primary"} onClick={onToggle} aria-pressed={!!status}>
      {status === "accepted" ? tr("עוקב ✓") : status === "pending" ? tr("בקשה נשלחה") : <><Icon name="userplus" size={18} /> {tr("עקוב")}</>}
    </button>
  );
}
