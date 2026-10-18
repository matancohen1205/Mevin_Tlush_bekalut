/** Pure time formatting helpers. */

/** Formats seconds as m:ss (e.g. 75 → "1:15"). */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** "5 min. ago" / "לפני 5 דק׳" style text for a past timestamp, in the given locale. */
export function relativeTime(timestamp: number, locale: string, now: number = Date.now()): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "short" });
  const minutes = Math.max(1, Math.round((now - timestamp) / 60000));
  if (minutes < 60) return rtf.format(-minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (hours < 24) return rtf.format(-hours, "hour");
  return rtf.format(-Math.round(hours / 24), "day");
}

/** Share of `max` that `value` represents, clamped to 0–100 (for slider fills). */
export function percentOf(value: number, max: number): number {
  return max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
}
