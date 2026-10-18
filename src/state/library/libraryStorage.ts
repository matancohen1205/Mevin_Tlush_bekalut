/** Local persistence of the library (liked songs + playlists). */
import { readJson, writeJson } from "../../services/storage/localStore";
import type { Playlist, Track } from "../../types";

export interface LibrarySnapshot {
  liked: Track[];
  playlists: Playlist[];
}

const KEY = "wavely.library.v2";
const LEGACY_LIKED_KEY = "wavely.liked.v1";

/** Loads the saved library, migrating the old liked-only format if that is all there is. */
export function loadLibrary(): LibrarySnapshot {
  const saved = readJson<LibrarySnapshot | null>(KEY, null);
  return saved ?? { liked: readJson<Track[]>(LEGACY_LIKED_KEY, []), playlists: [] };
}

/** Saves the library. */
export function saveLibrary(snapshot: LibrarySnapshot): void {
  writeJson(KEY, snapshot);
}
