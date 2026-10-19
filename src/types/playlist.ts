/** Playlist types. */
import type { Track } from "./track";

export interface Playlist {
  id: string;
  title: string;
  description: string;
  visibility: "public" | "private";
  tracks: Track[];
  createdAt: number;
  /** ids of people invited to add songs (empty = a normal, solo playlist) */
  collaborators: string[];
  /** track id → id of the person who added it (only recorded on collaborative playlists) */
  addedBy: Record<string, string>;
}

/** A track as carried inside a share link: only what is needed to show and play it. */
export interface SharedTrack {
  id: string;
  title: string;
  artist: string;
  durationMs: number;
  source: Track["source"];
  previewUrl?: string;
  sourceUrl?: string;
  full?: boolean;
  /** omitted for generated covers, which are recreated on the receiving side */
  artwork?: string;
}

/** The playlist snapshot inside a share link. `v` allows changing the format later. */
export interface SharePayload {
  v: 1;
  title: string;
  description: string;
  /** display name of the person sharing */
  by: string;
  tracks: SharedTrack[];
}
