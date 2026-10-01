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

export interface Profile {
  id: string;
  handle: string;
  name: string;
  bio: string;
  hue: number;
  isPrivate: boolean;
  favArtists: string[];
}

export interface Comment {
  id: string;
  authorId: string;
  body: string;
  createdAt: number;
}

export interface SharedPlaylist {
  title: string;
  description: string;
  tracks: Track[];
}

export interface Post {
  id: string;
  authorId: string;
  kind: "track" | "playlist" | "now_playing";
  caption: string;
  track?: Track;
  playlist?: SharedPlaylist;
  createdAt: number;
  likes: string[];
  comments: Comment[];
}

export interface Notif {
  id: string;
  type: "follow" | "like" | "comment" | "accepted";
  actorId: string;
  postId?: string;
  createdAt: number;
  read: boolean;
}
