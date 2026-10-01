import type { Profile } from "../types";
import { tr, useLang, locale } from "../i18n";

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

export function timeAgo(ts: number): string {
  const rtf = new Intl.RelativeTimeFormat(locale(), { numeric: "auto", style: "short" });
  const m = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (m < 60) return rtf.format(-m, "minute");
  const h = Math.round(m / 60);
  if (h < 24) return rtf.format(-h, "hour");
  return rtf.format(-Math.round(h / 24), "day");
}
