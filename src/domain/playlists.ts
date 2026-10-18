/** Pure playlist and liked-songs rules, plus the diff used to sync the library to the cloud. */
import type { Playlist, Track } from "../types";

export interface NewPlaylistOptions {
  description?: string;
  visibility?: Playlist["visibility"];
  tracks?: Track[];
}

/** Builds a playlist; `id` and `now` are injected so the function stays pure. */
export function buildPlaylist(title: string, fallbackTitle: string, id: string, now: number, opts: NewPlaylistOptions = {}): Playlist {
  return {
    id,
    title: title.trim() || fallbackTitle,
    description: opts.description ?? "",
    visibility: opts.visibility ?? "private",
    tracks: opts.tracks ?? [],
    createdAt: now,
  };
}

/** Adds a track unless it is already in the playlist. */
export function addTrack(pl: Playlist, track: Track): Playlist {
  return pl.tracks.some((t) => t.id === track.id) ? pl : { ...pl, tracks: [...pl.tracks, track] };
}

/** Removes the track with `trackId`. */
export function removeTrack(pl: Playlist, trackId: string): Playlist {
  return { ...pl, tracks: pl.tracks.filter((t) => t.id !== trackId) };
}

/** Moves a track inside the playlist (drag and drop). */
export function reorderTracks(pl: Playlist, from: number, to: number): Playlist {
  const tracks = [...pl.tracks];
  const [moved] = tracks.splice(from, 1);
  tracks.splice(to, 0, moved);
  return { ...pl, tracks };
}

/** Adds the track to the liked list, or removes it when already liked (newest first). */
export function toggleLiked(liked: readonly Track[], track: Track): Track[] {
  return liked.some((t) => t.id === track.id) ? liked.filter((t) => t.id !== track.id) : [track, ...liked];
}

/** True when a track id is in the liked list. */
export const isLiked = (liked: readonly Track[], id: string): boolean => liked.some((t) => t.id === id);

/** Fingerprint of the parts of a playlist that are stored remotely; equal hashes mean "nothing to sync". */
export function playlistHash(p: Playlist): string {
  return JSON.stringify([p.title, p.description, p.visibility, p.tracks.map((t) => t.id)]);
}

/** What has already been pushed to the cloud. */
export interface SyncedState {
  likes: ReadonlySet<string>;
  playlists: ReadonlyMap<string, string>;
}

export interface LibraryDiff {
  likesToAdd: Track[];
  likesToRemove: string[];
  playlistsToSave: Playlist[];
  playlistsToDelete: string[];
}

/** Computes the minimal set of remote writes needed to bring the cloud in line with the local library. */
export function diffLibrary(synced: SyncedState, liked: readonly Track[], playlists: readonly Playlist[]): LibraryDiff {
  const likedIds = new Set(liked.map((t) => t.id));
  const liveIds = new Set(playlists.map((p) => p.id));
  return {
    likesToAdd: liked.filter((t) => !synced.likes.has(t.id)),
    likesToRemove: [...synced.likes].filter((id) => !likedIds.has(id)),
    playlistsToSave: playlists.filter((p) => synced.playlists.get(p.id) !== playlistHash(p)),
    playlistsToDelete: [...synced.playlists.keys()].filter((id) => !liveIds.has(id)),
  };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Gives every playlist a UUID id (needed by the cloud schema); existing UUIDs are kept. */
export function withUuidIds(playlists: readonly Playlist[], newId: () => string): Playlist[] {
  return playlists.map((p) => (UUID.test(p.id) ? p : { ...p, id: newId() }));
}
