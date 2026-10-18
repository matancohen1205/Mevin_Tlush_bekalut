/** Cloud sync steps for the library: first load after login, and pushing local changes. */
import { diffLibrary, playlistHash, withUuidIds } from "../../domain/playlists";
import { fetchLibrary, removePlaylist, savePlaylist, setLike } from "../../services/cloud/libraryApi";
import type { Track } from "../../types";
import type { LibrarySnapshot } from "./libraryStorage";

/** Records what the cloud already holds, so only differences are pushed. */
export interface SyncMark {
  uid: string;
  likes: Set<string>;
  playlists: Map<string, string>;
}

/** Marks a cloud snapshot as already synced. */
const markFrom = (uid: string, lib: LibrarySnapshot): SyncMark => ({
  uid,
  likes: new Set(lib.liked.map((t) => t.id)),
  playlists: new Map(lib.playlists.map((p) => [p.id, playlistHash(p)])),
});

/**
 * Loads the account's library. If the account is empty and there is local data (made as a guest),
 * the local data wins and will be uploaded by the next push.
 */
export async function initialSync(uid: string, local: LibrarySnapshot): Promise<{ library: LibrarySnapshot; mark: SyncMark }> {
  const cloud = await fetchLibrary(uid);
  const cloudEmpty = !cloud.liked.length && !cloud.playlists.length;
  const hasLocal = local.liked.length > 0 || local.playlists.length > 0;
  if (cloudEmpty && hasLocal) {
    const playlists = withUuidIds(local.playlists, () => crypto.randomUUID());
    return { library: { liked: local.liked, playlists }, mark: { uid, likes: new Set(), playlists: new Map() } };
  }
  return { library: cloud, mark: markFrom(uid, cloud) };
}

/** Pushes the difference between `library` and what the cloud holds, updating `mark` as each write succeeds. */
export async function pushChanges(mark: SyncMark, library: LibrarySnapshot): Promise<void> {
  const diff = diffLibrary(mark, library.liked, library.playlists);
  for (const track of diff.likesToAdd) { await setLike(mark.uid, track, true); mark.likes.add(track.id); }
  for (const id of diff.likesToRemove) { await setLike(mark.uid, { id } as Track, false); mark.likes.delete(id); }
  for (const playlist of diff.playlistsToSave) { await savePlaylist(mark.uid, playlist); mark.playlists.set(playlist.id, playlistHash(playlist)); }
  for (const id of diff.playlistsToDelete) { await removePlaylist(id); mark.playlists.delete(id); }
}
