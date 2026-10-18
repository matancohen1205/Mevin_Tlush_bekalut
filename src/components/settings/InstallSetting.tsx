/** "Install the app" row; shown only where installing is possible (or explained, on iOS). */
import { useInstall } from "../../hooks/useInstall";
import { tr, useLang } from "../../i18n";
import { SettingRow } from "./SettingRow";

/** Button on Chrome/Android, instructions on Safari. */
export function InstallSetting() {
  useLang();
  const { install, ios } = useInstall();
  if (!install && !ios) return null;
  return (
    <SettingRow title={tr("התקנת האפליקציה")} hint={install ? tr("הוסיפו את Wavely למסך הבית") : tr("בספארי: שיתוף ← הוספה למסך הבית")}>
      {install && <button className="chip" onClick={install}>{tr("התקנה")}</button>}
    </SettingRow>
  );
}
