/**
 * Pure rules behind "smart create": turn a free-text description (Hebrew or English)
 * into search terms, and merge the search results into one playlist.
 * Kept free of I/O so it can later be swapped for an LLM that returns the same shapes.
 */
import type { Track } from "../types";

/** keyword pattern → search term sent to the music provider */
const KEYWORDS: readonly [RegExp, string][] = [
  [/רגוע|שקט|chill|calm|relax/i, "chill acoustic"],
  [/אנרגטי|ספורט|ריצה|אימון|workout|dance|party|מסיבה/i, "dance workout"],
  [/ריכוז|לימודים|עבודה|focus|study|lofi/i, "lofi instrumental"],
  [/שינה|לילה|sleep|night|ambient/i, "ambient sleep"],
  [/נסיעה|דרך|road|drive/i, "road trip"],
  [/רוק|rock/i, "rock"],
  [/פופ|pop/i, "pop hits"],
  [/היפ.?הופ|ראפ|rap|hip.?hop/i, "hip hop"],
  [/ג׳?אז|jazz/i, "jazz"],
  [/קלאסי|פסנתר|classical|piano/i, "classical piano"],
  [/לטין|לטיני|latin|reggaeton/i, "latin"],
  [/קוריאה|k-?pop/i, "k-pop"],
  [/ים תיכוני|מזרחי|mizrahi|mediterranean/i, "mediterranean"],
  [/רומנטי|אהבה|love|romantic/i, "love songs"],
  [/שמח|שמחה|happy|summer|קיץ/i, "happy summer"],
  [/עצוב|געגוע|sad|melancholy/i, "sad ballads"],
];

export const MAX_TERMS = 3;
export const MAX_TRACKS = 15;

/** Search terms for a description: up to three matched vibes, or the raw text when nothing matches. */
export function termsFromPrompt(prompt: string): string[] {
  const terms = KEYWORDS.filter(([re]) => re.test(prompt)).map(([, term]) => term).slice(0, MAX_TERMS);
  return terms.length ? terms : [prompt.trim()];
}

/** Interleaves several result lists (so every vibe is represented), drops duplicates, caps the length. */
export function interleaveTracks(lists: readonly (readonly Track[])[], limit: number = MAX_TRACKS): Track[] {
  const seen = new Set<string>();
  const merged: Track[] = [];
  const longest = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < longest; i++)
    for (const list of lists) {
      const track = list[i];
      if (track && !seen.has(track.id)) {
        seen.add(track.id);
        merged.push(track);
      }
    }
  return merged.slice(0, limit);
}

/** Playlist title derived from the description (shortened when long). */
export function titleFromPrompt(prompt: string, maxLength = 32): string {
  const text = prompt.trim();
  return text.length > maxLength ? text.slice(0, maxLength - 2) + "…" : text;
}
