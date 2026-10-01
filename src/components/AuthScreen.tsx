import { useState } from "react";
import { useAuth } from "../state/auth";
import { Logo } from "./Logo";

export function AuthScreen() {
  const auth = useAuth();
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
      if (r.needsConfirm) setInfo("שלחנו אליכם מייל אימות. אחרי שתלחצו על הקישור אפשר להתחבר.");
    }
    setBusy(false);
  };

  return (
    <div className="onboard" role="dialog" aria-modal="true" aria-label="התחברות">
      <form className="onboard-in" onSubmit={submit}>
        <div className="logo" lang="en"><Logo /> Wavely</div>
        <h1>{mode === "in" ? "ברוכים השבים" : "יוצרים חשבון"}</h1>
        <p className="muted">{mode === "in" ? "התחברו כדי לשמור את הפלייליסטים והשירים האהובים בכל מכשיר." : "הצטרפו לקהילת Wavely ושמרו את המוזיקה שלכם בענן."}</p>

        {mode === "up" && (<><label className="lbl" htmlFor="an">שם</label>
          <input id="an" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required maxLength={30} /></>)}
        <label className="lbl" htmlFor="ae">אימייל</label>
        <input id="ae" className="input" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        <label className="lbl" htmlFor="ap">סיסמה</label>
        <input id="ap" className="input" type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "in" ? "current-password" : "new-password"} required minLength={6} />

        {error && <p className="form-msg err" role="alert">{error}</p>}
        {info && <p className="form-msg" role="status">{info}</p>}

        <button className="btn primary wide" disabled={busy}>{busy ? "רגע…" : mode === "in" ? "התחברות" : "הרשמה"}</button>
        <button type="button" className="skip" onClick={() => { setMode(mode === "in" ? "up" : "in"); setError(null); setInfo(null); }}>
          {mode === "in" ? "אין לכם חשבון? הרשמה" : "כבר יש חשבון? התחברות"}
        </button>
        <button type="button" className="skip" onClick={auth.continueAsGuest}>המשך כאורח (הנתונים יישמרו רק במכשיר הזה)</button>
      </form>
    </div>
  );
}
