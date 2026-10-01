export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  artwork: string;
  /** Direct audio URL. Absent for demo tracks (playback is simulated). */
  previewUrl?: string;
  durationMs: number;
  genre?: string;
  country?: string;
  /** Where the track comes from – shown in the player for attribution. */
  source: "itunes" | "demo";
  sourceUrl?: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  visibility: "public" | "private";
  tracks: Track[];
  createdAt: number;
}
