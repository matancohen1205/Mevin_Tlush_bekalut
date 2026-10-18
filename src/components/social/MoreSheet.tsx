/** "More actions" menu for a post or user: delete (own post), report, block. */
import { useState } from "react";
import { tr, useLang } from "../../i18n";
import { useSocial } from "../../state/social";
import { useUi } from "../../state/ui";
import { Icon } from "../common/Icon";
import { Modal } from "../layout/Modal";

const REPORT_REASONS = ["ספאם", "תוכן פוגעני", "הטרדה", "אחר"];
type Step = "menu" | "report" | "block";

/** Multi-step menu. Reports are acknowledged locally; blocking updates the community state. */
export function MoreSheet({ postId, userId }: { postId?: string; userId: string }) {
  useLang();
  const social = useSocial();
  const { setSheet, showToast } = useUi();
  const [step, setStep] = useState<Step>("menu");
  const user = social.profileOf(userId);
  if (!user) return null;
  const mine = userId === "me";
  const name = tr(user.name);

  /** Shows a confirmation and closes the dialog. */
  const done = (message: string) => { showToast(message); setSheet(null); };

  if (step === "report")
    return (
      <Modal title={tr("דיווח")}>
        <p className="muted">{tr("למה אתם מדווחים?")}</p>
        <div className="rows" style={{ marginTop: 8 }}>
          {REPORT_REASONS.map((r) => <button key={r} className="row" onClick={() => done(tr("הדיווח התקבל, תודה"))}>{tr(r)}</button>)}
        </div>
      </Modal>
    );
  if (step === "block")
    return (
      <Modal title={tr("לחסום את {name}?", { name })}>
        <p className="muted">{tr("לא תראו יותר תוכן ממנו/ה, והוא/היא לא יוכלו לעקוב אחריכם. אפשר לבטל בהגדרות הפרטיות.")}</p>
        <button className="btn primary wide" onClick={() => { social.block(userId); done(tr("{name} נחסם/ה", { name })); }}>{tr("חסום")}</button>
      </Modal>
    );
  return (
    <Modal title={tr("עוד פעולות")}>
      <div className="rows">
        {mine && postId && <button className="row" onClick={() => { social.deletePost(postId); done(tr("השיתוף נמחק")); }}><Icon name="trash" /> {tr("מחק שיתוף")}</button>}
        {!mine && <button className="row" onClick={() => setStep("report")}><Icon name="flag" /> {tr("דווח")}</button>}
        {!mine && <button className="row" onClick={() => setStep("block")}><Icon name="close" /> {tr("חסום את {name}", { name })}</button>}
      </div>
    </Modal>
  );
}
