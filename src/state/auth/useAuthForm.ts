/** State and submit logic of the sign-in / sign-up form. */
import { useState, type FormEvent } from "react";
import { tr } from "../../i18n";
import { useAuth } from "./AuthContext";

export type AuthMode = "in" | "up";

/** Form fields, messages and handlers for the auth screen. */
export function useAuthForm() {
  const auth = useAuth();
  const [mode, setMode] = useState<AuthMode>("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /** Sends the form to sign in or sign up and reports the outcome. */
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    if (mode === "in") {
      setError(await auth.signIn(email.trim(), password));
    } else {
      const result = await auth.signUp(email.trim(), password, name.trim());
      setError(result.error);
      if (result.needsConfirm) setInfo(tr("שלחנו אליכם מייל אימות. אחרי שתלחצו על הקישור אפשר להתחבר."));
    }
    setBusy(false);
  };

  /** Switches between sign-in and sign-up and clears old messages. */
  const switchMode = () => {
    setMode((m) => (m === "in" ? "up" : "in"));
    setError(null);
    setInfo(null);
  };

  return { mode, name, email, password, error, info, busy, setName, setEmail, setPassword, submit, switchMode, continueAsGuest: auth.continueAsGuest };
}
