/** Round avatar: the first letter of the name on a hue-based gradient. */
import type { Profile } from "../../types";
import { tr, useLang } from "../../i18n";

/** `size` is the diameter in pixels. Seeded names are translated; the letter follows the language. */
export function Avatar({ user, size = 44 }: { user: Pick<Profile, "name" | "hue">; size?: number }) {
  useLang();
  const initial = Array.from(tr(user.name).trim())[0] ?? "?";
  return (
    <span
      className="avatar"
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.42, background: `linear-gradient(135deg, hsl(${user.hue} 62% 46%), hsl(${user.hue} 65% 34%))` }}
    >
      {initial}
    </span>
  );
}
