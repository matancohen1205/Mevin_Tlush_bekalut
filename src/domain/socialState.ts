/** Pure state transitions for the community snapshot (follow, block, posts, comments, notifications). */
import type { Comment, FollowStatus, Notif, Post, Profile, SocialSnapshot } from "../types";

export type NewPost = Pick<Post, "kind" | "caption" | "track" | "playlist">;
export type NewNotif = Omit<Notif, "id" | "createdAt" | "read">;

/** Sets the follow status for a user. */
export const setFollow = (s: SocialSnapshot, id: string, status: FollowStatus): SocialSnapshot => ({ ...s, following: { ...s.following, [id]: status } });

/** Removes a follow relationship (unfollow or cancel request). */
export function removeFollow(s: SocialSnapshot, id: string): SocialSnapshot {
  const following = { ...s.following };
  delete following[id];
  return { ...s, following };
}

/** Accepts a pending follow, but only if it still exists (the user may have cancelled meanwhile). */
export const acceptIfPending = (s: SocialSnapshot, id: string): SocialSnapshot => (s.following[id] ? setFollow(s, id, "accepted") : s);

/** Blocks a user and drops any follow relationship with them. */
export const blockUser = (s: SocialSnapshot, id: string): SocialSnapshot => ({ ...removeFollow(s, id), blocked: [...new Set([...s.blocked, id])] });

/** Lifts a block. */
export const unblockUser = (s: SocialSnapshot, id: string): SocialSnapshot => ({ ...s, blocked: s.blocked.filter((b) => b !== id) });

/** Puts a new post written by the current user at the top of the feed. */
export function addPost(s: SocialSnapshot, post: NewPost, id: string, now: number): SocialSnapshot {
  return { ...s, posts: [{ ...post, id, authorId: "me", createdAt: now, likes: [], comments: [] }, ...s.posts] };
}

/** Deletes a post. */
export const removePost = (s: SocialSnapshot, id: string): SocialSnapshot => ({ ...s, posts: s.posts.filter((p) => p.id !== id) });

/** Applies `change` to one post. */
export const updatePost = (s: SocialSnapshot, id: string, change: (p: Post) => Post): SocialSnapshot => ({ ...s, posts: s.posts.map((p) => (p.id === id ? change(p) : p)) });

/** Appends a comment to a post. */
export const withComment = (post: Post, comment: Comment): Post => ({ ...post, comments: [...post.comments, comment] });

/** Adds a notification at the top of the list. */
export const addNotification = (s: SocialSnapshot, n: NewNotif, id: string, now: number): SocialSnapshot => ({ ...s, notifs: [{ ...n, id, createdAt: now, read: false }, ...s.notifs] });

/** Marks every notification as read. */
export const markAllRead = (s: SocialSnapshot): SocialSnapshot => ({ ...s, notifs: s.notifs.map((n) => ({ ...n, read: true })) });

/** Edits the current user's profile. */
export const updateProfile = (s: SocialSnapshot, patch: Partial<Pick<Profile, "name" | "handle" | "bio" | "isPrivate">>): SocialSnapshot => ({ ...s, me: { ...s.me, ...patch } });

/** Number of unread notifications. */
export const countUnread = (s: Pick<SocialSnapshot, "notifs">): number => s.notifs.filter((n) => !n.read).length;
