/** Language row with the Hebrew/English switch. */
import { tr, useLang } from "../../i18n";
import { LangSwitch } from "../common/LangSwitch";
import { SettingRow } from "./SettingRow";

/** Settings entry for the interface language. */
export function LanguageSetting() {
  useLang();
  return <SettingRow title={tr("שפה")} hint={tr("עברית או English")}><LangSwitch /></SettingRow>;
}
