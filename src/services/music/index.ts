import type { Track } from "../../types";
import { demoProvider } from "./demo";
import { itunesProvider } from "./itunes";
import type { MusicProvider } from "./provider";

export { COUNTRIES, GENRES, MOODS } from "./provider";

export interface Result {
  tracks: Track[];
  /** true when the live provider failed and demo data was used */
  offline: boolean;
}

async function withFallback(run: (p: MusicProvider) => Promise<Track[]>): Promise<Result> {
  try {
    const tracks = await run(itunesProvider);
    return { tracks, offline: false };
  } catch {
    return { tracks: await run(demoProvider), offline: true };
  }
}

export const music = {
  charts: (country: string, limit?: number) => withFallback((p) => p.charts(country, limit)),
  search: (query: string, country?: string, limit?: number) => withFallback((p) => p.search(query, country, limit)),
};
