/** Popular tracks for a country (or global trending, depending on the source). */
import { music, type Source } from "../../services/music";
import { useLoadedTracks } from "./useLoadedTracks";

const DEFAULT_LIMIT = 12;

/** Charts for `country` from `source`; null while loading. */
export function useCharts(country: string, source: Source, limit: number = DEFAULT_LIMIT) {
  return useLoadedTracks(() => music.charts(country, limit, source), [country, source, limit]);
}
