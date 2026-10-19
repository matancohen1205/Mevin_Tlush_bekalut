import type { Playlist, Track } from "../../types";

/** Minimal track for tests. */
export const track = (id: string, artist = "Artist"): Track => ({ id, title: `Song ${id}`, artist, artwork: "", durationMs: 1000, source: "demo" });

/** Minimal playlist for tests. */
export const playlist = (id: string, tracks: Track[] = []): Playlist => ({ id, title: "P", description: "", visibility: "private", tracks, createdAt: 0, collaborators: [], addedBy: {} });
