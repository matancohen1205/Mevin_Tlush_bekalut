/** The "Settings and privacy" block of the profile page. */
import { tr, useLang } from "../../i18n";
import { useSocial } from "../../state/social";
import { useUi } from "../../state/ui";
import { AccountSetting } from "./AccountSetting";
import { BlockedUsers } from "./BlockedUsers";
import { InstallSetting } from "./InstallSetting";
import { LanguageSetting } from "./LanguageSetting";
import { PrivacySetting } from "./PrivacySetting";

/** Groups the individual settings, the showcase disclaimer and the demo reset button. */
export function SettingsSection() {
  useLang();
  const { reset } = useSocial();
  const { showToast } = useUi();
  return (
    <section className="section settings">
      <div className="section-head"><h2>{tr("הגדרות ופרטיות")}</h2></div>
      <PrivacySetting />
      <BlockedUsers />
      <LanguageSetting />
      <InstallSetting />
      <AccountSetting />
      <p className="about">{tr("Wavely הוא פרויקט תצוגה ללא מטרות רווח ואינו קשור ל-Apple או ל-Audius. תצוגות מקדימות באדיבות Apple Music, שירים מלאים באדיבות Audius, וכל זכויות השירים שמורות ליוצריהם.")}</p>
      <button className="chip danger" onClick={() => { reset(); showToast("נתוני הקהילה אופסו"); }}>{tr("איפוס נתוני הדמו של הקהילה")}</button>
    </section>
  );
}
