/** Pure rules for composing a community post from what the user picked. */
import type { Playlist, Track } from "../types";
import type { NewPost } from "./socialState";

export type ShareKind = "track" | "playlist";

const MAX_SHAREABLE = 12;

/** Songs offered for sharing: the one playing now first, then liked songs (no duplicates). */
export function shareableTracks(current: Track | null, liked: readonly Track[], limit: number = MAX_SHAREABLE): Track[] {
  return [...(current ? [current] : []), ...liked.filter((t) => t.id !== current?.id)].slice(0, limit);
}

/** The kind of share to preselect: the playing song, else a playlist if one exists, else a song. */
export function defaultShareKind(current: Track | null, playlists: readonly Playlist[]): ShareKind {
  return current || playlists.length === 0 ? "track" : "playlist";
}

/** True when the picked content can be posted (a song, or a non-empty playlist). */
export function canPublish(kind: ShareKind, track: Track | null, playlist: Playlist | undefined): boolean {
  return kind === "track" ? !!track : !!playlist && playlist.tracks.length > 0;
}

/**
 * Builds the post. Sharing the song that is playing, without a caption, becomes a "now playing" card.
 * Returns null when nothing valid was picked.
 */
export function buildPost(kind: ShareKind, track: Track | null, playlist: Playlist | undefined, caption: string, nowPlayingId?: string): NewPost | null {
  const text = caption.trim();
  if (kind === "track" && track) return { kind: track.id === nowPlayingId && !text ? "now_playing" : "track", caption: text, track };
  if (kind === "playlist" && playlist) return { kind: "playlist", caption: text, playlist: { title: playlist.title, description: playlist.description, tracks: playlist.tracks } };
  return null;
}
