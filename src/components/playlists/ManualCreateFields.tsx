/** Manual playlist inputs: name and description. */
import { tr, useLang } from "../../i18n";

interface Props {
  title: string;
  description: string;
  onTitle: (value: string) => void;
  onDescription: (value: string) => void;
}

/** Name + description fields. */
export function ManualCreateFields({ title, description, onTitle, onDescription }: Props) {
  useLang();
  return (
    <>
      <label className="lbl" htmlFor="pt">{tr("שם")}</label>
      <input id="pt" className="input" value={title} onChange={(e) => onTitle(e.target.value)} placeholder={tr("הפלייליסט שלי")} />
      <label className="lbl" htmlFor="pd">{tr("תיאור")}</label>
      <textarea id="pd" className="input" rows={2} value={description} onChange={(e) => onDescription(e.target.value)} />
    </>
  );
}
