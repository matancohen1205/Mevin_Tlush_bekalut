import type { Track } from "../../types";
import { audiusProvider } from "./audius";
import { demoProvider } from "./demo";
import { itunesProvider } from "./itunes";
import type { MusicProvider } from "./provider";

export { COUNTRIES, GENRES, MOODS } from "./provider";

/** Live sources the user can choose between. */
export type Source = "itunes" | "audius";
export const SOURCES: Record<Source, MusicProvider> = { itunes: itunesProvider, audius: audiusProvider };

export interface Result {
  tracks: Track[];
  /** true when the live provider failed and demo data was used */
  offline: boolean;
}

async function withFallback(source: Source, run: (p: MusicProvider) => Promise<Track[]>): Promise<Result> {
  try {
    return { tracks: await run(SOURCES[source]), offline: false };
  } catch {
    return { tracks: await run(demoProvider), offline: true };
  }
}

export const music = {
  charts: (country: string, limit?: number, source: Source = "itunes") => withFallback(source, (p) => p.charts(country, limit)),
  search: (query: string, country?: string, limit?: number, source: Source = "itunes") => withFallback(source, (p) => p.search(query, country, limit)),
};
