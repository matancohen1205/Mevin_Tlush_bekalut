/** Playlist types. */
import type { Track } from "./track";

export interface Playlist {
  id: string;
  title: string;
  description: string;
  visibility: "public" | "private";
  tracks: Track[];
  createdAt: number;
}
