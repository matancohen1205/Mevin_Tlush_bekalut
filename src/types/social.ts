/** Community types: profiles, posts, comments and notifications. */
import type { Track } from "./track";

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
