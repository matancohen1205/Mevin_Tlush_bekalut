/** Full-screen sign-in / sign-up form (shown only when cloud accounts are configured). */
import { useDialog } from "../../hooks/useDialog";
import { tr, useLang } from "../../i18n";
import { useAuthForm } from "../../state/auth";
import { LangSwitch } from "../common/LangSwitch";
import { Logo } from "../common/Logo";

/** Form markup; all behaviour lives in useAuthForm. */
export function AuthScreen() {
  useLang();
  const f = useAuthForm();
  const dialog = useDialog<HTMLDivElement>();
  const signIn = f.mode === "in";

  return (
    <div ref={dialog} tabIndex={-1} className="onboard" role="dialog" aria-modal="true" aria-label={tr("התחברות")}>
      <form className="onboard-in" onSubmit={f.submit}>
        <div className="topbar"><div className="logo" lang="en"><Logo /> Wavely</div><LangSwitch /></div>
        <h1>{signIn ? tr("ברוכים השבים") : tr("יוצרים חשבון")}</h1>
        <p className="muted">{signIn ? tr("התחברו כדי לשמור את הפלייליסטים והשירים האהובים בכל מכשיר.") : tr("הצטרפו לקהילת Wavely ושמרו את המוזיקה שלכם בענן.")}</p>

        {!signIn && <><label className="lbl" htmlFor="an">{tr("שם")}</label>
          <input id="an" className="input" value={f.name} onChange={(e) => f.setName(e.target.value)} autoComplete="name" required maxLength={30} /></>}
        <label className="lbl" htmlFor="ae">{tr("אימייל")}</label>
        <input id="ae" className="input" type="email" dir="ltr" value={f.email} onChange={(e) => f.setEmail(e.target.value)} autoComplete="email" required />
        <label className="lbl" htmlFor="ap">{tr("סיסמה")}</label>
        <input id="ap" className="input" type="password" dir="ltr" value={f.password} onChange={(e) => f.setPassword(e.target.value)} autoComplete={signIn ? "current-password" : "new-password"} required minLength={6} />

        {f.error && <p className="form-msg err" role="alert">{f.error}</p>}
        {f.info && <p className="form-msg" role="status">{f.info}</p>}

        <button className="btn primary wide" disabled={f.busy}>{f.busy ? tr("רגע…") : signIn ? tr("התחברות") : tr("הרשמה")}</button>
        <button type="button" className="skip" onClick={f.switchMode}>{signIn ? tr("אין לכם חשבון? הרשמה") : tr("כבר יש חשבון? התחברות")}</button>
        <button type="button" className="skip" onClick={f.continueAsGuest}>{tr("המשך כאורח (הנתונים יישמרו רק במכשיר הזה)")}</button>
      </form>
    </div>
  );
}
