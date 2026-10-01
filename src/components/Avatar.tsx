import type { Profile } from "../types";

export function Avatar({ user, size = 44 }: { user: Pick<Profile, "name" | "hue">; size?: number }) {
  const initial = Array.from(user.name.trim())[0] ?? "?";
  return (
    <span
      className="avatar"
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.42, background: `linear-gradient(135deg, hsl(${user.hue} 75% 78%), hsl(${user.hue} 65% 46%))` }}
    >
      {initial}
    </span>
  );
}

export function timeAgo(ts: number): string {
  const m = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (m < 60) return `לפני ${m} ד׳`;
  const h = Math.round(m / 60);
  if (h < 24) return `לפני ${h} ש׳`;
  return `לפני ${Math.round(h / 24)} ימים`;
}
