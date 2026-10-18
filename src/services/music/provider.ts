/** Contract every music source (Apple, Audius, demo, future ones) implements. */
import type { Track } from "../../types";

export interface MusicProvider {
  id: string;
  /** Popular tracks, for a country where the source supports it. */
  charts(country: string, limit?: number): Promise<Track[]>;
  /** Free-text search. */
  search(query: string, country?: string, limit?: number): Promise<Track[]>;
}
