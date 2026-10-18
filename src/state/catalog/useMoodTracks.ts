/** Tracks that match a mood chip (chill, focus, …). */
import { MOODS, music, type Source } from "../../services/music";
import { useLoadedTracks } from "./useLoadedTracks";

const LIMIT = 12;

/** Tracks for the selected mood, or null when no mood is selected or while loading. */
export function useMoodTracks(moodId: string | null, country: string, source: Source) {
  const term = MOODS.find((m) => m.id === moodId)?.term;
  return useLoadedTracks(term ? () => music.search(term, country, LIMIT, source) : null, [term, country, source]);
}
