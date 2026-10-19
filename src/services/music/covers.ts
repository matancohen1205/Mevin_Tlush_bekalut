/** Generated cover art for tracks that arrive without artwork (shared links, demo songs). */
import { cover } from "./demo";

/** Stable small hash of a string. */
const hash = (s: string): number => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** A gradient cover for the track: demo songs keep their own number, others get a hash of their id. */
export function coverFor(track: { id: string }): string {
  const demoNumber = Number(track.id.replace("demo-", ""));
  return cover(Number.isFinite(demoNumber) && track.id.startsWith("demo-") ? demoNumber : hash(track.id));
}
