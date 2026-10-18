/** Turns provider error messages into friendly, translatable text. */
import { tr } from "../../i18n";

/** provider message pattern → Hebrew source text (translated at runtime) */
const KNOWN_ERRORS: readonly [RegExp, string][] = [
  [/invalid login credentials/i, "האימייל או הסיסמה שגויים."],
  [/already registered|already been registered/i, "האימייל הזה כבר רשום. נסו להתחבר."],
  [/password should be at least/i, "הסיסמה קצרה מדי (לפחות 6 תווים)."],
  [/email not confirmed/i, "האימייל עוד לא אומת. בדקו את תיבת הדואר."],
  [/rate limit|too many/i, "יותר מדי ניסיונות. נסו שוב בעוד כמה דקות."],
  [/failed to fetch|network/i, "אין חיבור לשרת. בדקו את האינטרנט ונסו שוב."],
];

/** Friendly message for a raw error string; unknown errors get a generic message. */
export function friendlyAuthError(raw: string): string {
  return tr(KNOWN_ERRORS.find(([pattern]) => pattern.test(raw))?.[1] ?? "משהו השתבש. נסו שוב.");
}
