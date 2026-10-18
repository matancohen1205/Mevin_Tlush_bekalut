/** Smart-create inputs: a free-text description plus tappable example ideas. */
import { tr, useLang } from "../../i18n";

const IDEAS = ["נסיעה בלילה עם רוק רגוע", "אימון אנרגטי בקיץ", "ריכוז ולימודים", "ערב רומנטי עם ג׳אז"];

/** Description box with quick-fill chips. */
export function SmartCreateFields({ prompt, onChange }: { prompt: string; onChange: (value: string) => void }) {
  useLang();
  return (
    <>
      <label className="lbl" htmlFor="pr">{tr("תארו את הפלייליסט שאתם רוצים")}</label>
      <textarea id="pr" className="input" rows={3} value={prompt} onChange={(e) => onChange(e.target.value)} placeholder={tr("למשל: פלייליסט לנסיעה בלילה עם רוק רגוע")} />
      <div className="chip-row">{IDEAS.map((idea) => <button key={idea} className="chip" onClick={() => onChange(tr(idea))}>{tr(idea)}</button>)}</div>
    </>
  );
}
