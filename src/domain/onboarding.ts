/** Pure rules of the first-run genre picker. */

export const MIN_GENRES = 3;

/** Adds the genre if missing, removes it if present. */
export const toggleGenre = (selected: readonly string[], id: string): string[] => (selected.includes(id) ? selected.filter((g) => g !== id) : [...selected, id]);

/** How many more genres the user still has to pick. */
export const genresLeft = (selected: readonly string[]): number => Math.max(0, MIN_GENRES - selected.length);
