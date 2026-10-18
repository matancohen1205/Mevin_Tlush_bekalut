/** Private-profile switch. */
import { tr, useLang } from "../../i18n";
import { useSocial } from "../../state/social";
import { SettingRow } from "./SettingRow";

/** When on, only approved followers can see the user's posts. */
export function PrivacySetting() {
  useLang();
  const { me, updateMe } = useSocial();
  return (
    <SettingRow as="label" title={tr("פרופיל פרטי")} hint={tr("רק עוקבים שאישרתם יראו את השיתופים שלכם")}>
      <input type="checkbox" role="switch" checked={me.isPrivate} onChange={(e) => updateMe({ isPrivate: e.target.checked })} />
    </SettingRow>
  );
}
