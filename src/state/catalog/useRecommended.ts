/** "For you": tracks matching the genres picked during onboarding. */
import { GENRES, music, type Source } from "../../services/music";
import { useLoadedTracks } from "./useLoadedTracks";

const LIMIT = 12;
const GENRES_USED = 2;

/** Search term built from the first two chosen genres; empty when none were chosen. */
export function termFromGenres(genreIds: readonly string[]): string {
  return genreIds.map((id) => GENRES.find((g) => g.id === id)?.term).filter(Boolean).slice(0, GENRES_USED).join(" ");
}

/** Recommendations for the chosen genres; null when none were chosen or while loading. */
export function useRecommended(genreIds: readonly string[], country: string, source: Source) {
  const term = termFromGenres(genreIds);
  return useLoadedTracks(term ? () => music.search(term, country, LIMIT, source) : null, [term, country, source]);
}
