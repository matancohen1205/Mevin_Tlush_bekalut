import { useState } from "react";
import { useAuth } from "../state/auth";
import { useDialog } from "./useDialog";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";
import { tr, useLang } from "../i18n";

export function AuthScreen() {
  useLang();
  const auth = useAuth();
  const dlg = useDialog<HTMLDivElement>();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null); setInfo(null);
    if (mode === "in") setError(await auth.signIn(email.trim(), password));
    else {
      const r = await auth.signUp(email.trim(), password, name.trim());
      setError(r.error);
      if (r.needsConfirm) setInfo(tr("שלחנו אליכם מייל אימות. אחרי שתלחצו על הקישור אפשר להתחבר."));
    }
    setBusy(false);
  };

  return (
    <div ref={dlg} tabIndex={-1} className="onboard" role="dialog" aria-modal="true" aria-label={tr("התחברות")}>
      <form className="onboard-in" onSubmit={submit}>
        <div className="topbar"><div className="logo" lang="en"><Logo /> Wavely</div><LangSwitch /></div>
        <h1>{mode === "in" ? tr("ברוכים השבים") : tr("יוצרים חשבון")}</h1>
        <p className="muted">{mode === "in" ? tr("התחברו כדי לשמור את הפלייליסטים והשירים האהובים בכל מכשיר.") : tr("הצטרפו לקהילת Wavely ושמרו את המוזיקה שלכם בענן.")}</p>

        {mode === "up" && (<><label className="lbl" htmlFor="an">{tr("שם")}</label>
          <input id="an" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required maxLength={30} /></>)}
        <label className="lbl" htmlFor="ae">{tr("אימייל")}</label>
        <input id="ae" className="input" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        <label className="lbl" htmlFor="ap">{tr("סיסמה")}</label>
        <input id="ap" className="input" type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "in" ? "current-password" : "new-password"} required minLength={6} />

        {error && <p className="form-msg err" role="alert">{error}</p>}
        {info && <p className="form-msg" role="status">{info}</p>}

        <button className="btn primary wide" disabled={busy}>{busy ? tr("רגע…") : mode === "in" ? tr("התחברות") : tr("הרשמה")}</button>
        <button type="button" className="skip" onClick={() => { setMode(mode === "in" ? "up" : "in"); setError(null); setInfo(null); }}>
          {mode === "in" ? tr("אין לכם חשבון? הרשמה") : tr("כבר יש חשבון? התחברות")}
        </button>
        <button type="button" className="skip" onClick={auth.continueAsGuest}>{tr("המשך כאורח (הנתונים יישמרו רק במכשיר הזה)")}</button>
      </form>
    </div>
  );
}
