/** Switch between the 30-second charts (Apple) and full songs (Audius), with a one-line explanation. */
import { tr, useLang } from "../../i18n";
import { usePrefs } from "../../state/prefs";

/** Radio-style segmented control bound to the music-source preference. */
export function SourceSwitch() {
  useLang();
  const { source, save } = usePrefs();
  return (
    <>
      <div className="seg source-seg" role="radiogroup" aria-label={tr("מקור מוזיקה")}>
        <button role="radio" aria-checked={source === "itunes"} aria-selected={source === "itunes"} onClick={() => save({ source: "itunes" })}>{tr("להיטים · 30 שניות")}</button>
        <button role="radio" aria-checked={source === "audius"} aria-selected={source === "audius"} onClick={() => save({ source: "audius" })}>{tr("שירים מלאים · Audius")}</button>
      </div>
      <p className="source-note">
        {source === "audius" ? tr("שירים מלאים של אמנים עצמאיים, בלי הגבלת זמן. אין מצעד לפי מדינה.") : tr("תצוגה מקדימה של 30 שניות ממצעדי כל מדינה.")}
      </p>
    </>
  );
}
