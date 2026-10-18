/** List of blocked users with an unblock button. */
import { tr, useLang } from "../../i18n";
import { useSocial } from "../../state/social";
import { Avatar } from "../common/Avatar";
import { SettingRow } from "./SettingRow";

/** Header row plus one row per blocked user. */
export function BlockedUsers() {
  useLang();
  const { blocked, profileOf, unblock } = useSocial();
  return (
    <>
      <SettingRow title={tr("משתמשים חסומים")} hint={blocked.length ? "" : tr("אין משתמשים חסומים")} />
      {blocked.map((id) => {
        const user = profileOf(id);
        return user && (
          <div key={id} className="row">
            <Avatar user={user} size={36} />
            <span className="meta"><div className="t">{user.name}</div></span>
            <button className="chip" onClick={() => unblock(id)}>{tr("בטל חסימה")}</button>
          </div>
        );
      })}
    </>
  );
}
