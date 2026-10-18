/** Community API (profiles, follows, feed actions, notifications) and its React context. */
import { createContext, useContext } from "react";
import type { NewPost } from "../../domain/socialState";
import type { Profile, SocialSnapshot, Track } from "../../types";

export interface SharedPlaylistView {
  title: string;
  description: string;
  tracks: Track[];
}

export interface SocialApi extends SocialSnapshot {
  profileOf: (id: string) => Profile | undefined;
  followersCount: (id: string) => number;
  followingCount: (id: string) => number;
  /** Can the current user see this profile's content? */
  canSee: (id: string) => boolean;
  playlistsOf: (id: string) => SharedPlaylistView[];
  unread: number;
  updateMe: (patch: Partial<Pick<Profile, "name" | "handle" | "bio" | "isPrivate">>) => void;
  toggleFollow: (id: string) => void;
  block: (id: string) => void;
  unblock: (id: string) => void;
  createPost: (post: NewPost) => void;
  deletePost: (id: string) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, body: string) => void;
  markRead: () => void;
  /** Restores the demo community to its starting state. */
  reset: () => void;
}

export const SocialContext = createContext<SocialApi | null>(null);

/** Access the community from any component under SocialProvider. */
export function useSocial(): SocialApi {
  const api = useContext(SocialContext);
  if (!api) throw new Error("useSocial outside SocialProvider");
  return api;
}
