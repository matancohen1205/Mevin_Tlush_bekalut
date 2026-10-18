/** "Smart create" orchestration: search the music source for each vibe, then merge the results. */
import { interleaveTracks, termsFromPrompt, titleFromPrompt } from "../../domain/smartPlaylist";
import type { Track } from "../../types";
import { music, type Source } from "./index";

export interface GeneratedPlaylist {
  title: string;
  tracks: Track[];
  /** true when the live source failed and demo songs were used */
  offline: boolean;
}

/** Builds a playlist for a free-text description using the chosen music source. */
export async function generatePlaylist(prompt: string, country: string, source: Source): Promise<GeneratedPlaylist> {
  const results = await Promise.all(termsFromPrompt(prompt).map((term) => music.search(term, country, 10, source)));
  return {
    title: titleFromPrompt(prompt),
    tracks: interleaveTracks(results.map((r) => r.tracks)),
    offline: results.some((r) => r.offline),
  };
}
