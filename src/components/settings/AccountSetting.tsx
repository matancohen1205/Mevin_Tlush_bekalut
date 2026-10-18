/** Account row: email and sign-out, or "guest" with a sign-in button. Hidden when cloud accounts are not configured. */
import { tr, useLang } from "../../i18n";
import { useAuth } from "../../state/auth";
import { SettingRow } from "./SettingRow";

/** Account status. */
export function AccountSetting() {
  useLang();
  const auth = useAuth();
  if (!auth.enabled) return null;
  return (
    <SettingRow title={tr("חשבון")} hint={<span dir="ltr">{auth.email ?? tr("אורח – הנתונים רק במכשיר הזה")}</span>}>
      {auth.userId
        ? <button className="chip" onClick={auth.signOut}>{tr("התנתקות")}</button>
        : <button className="chip" onClick={auth.leaveGuest}>{tr("התחברות")}</button>}
    </SettingRow>
  );
}
