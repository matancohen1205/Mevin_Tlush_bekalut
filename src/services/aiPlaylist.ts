import type { Track } from "../types";
import { music } from "./music";

/**
 * Rule-based playlist builder: maps a free-text description (Hebrew/English)
 * to search terms. It is intentionally isolated so it can later be replaced
 * by an LLM call that returns the same shape.
 */
const KEYWORDS: [RegExp, string][] = [
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

export interface Generated {
  title: string;
  tracks: Track[];
  offline: boolean;
}

export async function generatePlaylist(prompt: string, country: string): Promise<Generated> {
  const terms = KEYWORDS.filter(([re]) => re.test(prompt)).map(([, t]) => t).slice(0, 3);
  if (!terms.length) terms.push(prompt.trim());
  const results = await Promise.all(terms.map((t) => music.search(t, country, 10)));
  const seen = new Set<string>();
  const tracks: Track[] = [];
  // interleave so every requested vibe is represented
  const max = Math.max(...results.map((r) => r.tracks.length));
  for (let i = 0; i < max; i++)
    for (const r of results) {
      const t = r.tracks[i];
      if (t && !seen.has(t.id)) {
        seen.add(t.id);
        tracks.push(t);
      }
    }
  const title = prompt.trim().length > 32 ? prompt.trim().slice(0, 30) + "…" : prompt.trim();
  return { title, tracks: tracks.slice(0, 15), offline: results.some((r) => r.offline) };
}
