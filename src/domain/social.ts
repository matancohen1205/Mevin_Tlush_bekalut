/** Pure community rules: who can see what, follow states, feed selection, counters. */
import type { FollowStatus, Post, Profile, Track } from "../types";

export type { FollowStatus };
export type FollowMap = Readonly<Record<string, FollowStatus>>;
export type FeedTab = "following" | "discover";

/** Status a new follow request starts with: private profiles must approve first. */
export function initialFollowStatus(target: Pick<Profile, "isPrivate"> | undefined): FollowStatus {
  return target?.isPrivate ? "pending" : "accepted";
}

/** Can the viewer see the content of `profile`? (self, public profiles, or accepted followers) */
export function canViewProfile(profile: Profile | undefined, following: FollowMap, viewerId = "me"): boolean {
  if (!profile) return false;
  return profile.id === viewerId || !profile.isPrivate || following[profile.id] === "accepted";
}

/** Posts to show in a feed tab, newest first, excluding blocked authors. */
export function selectFeed(
  posts: readonly Post[],
  tab: FeedTab,
  ctx: { following: FollowMap; blocked: readonly string[]; profileOf: (id: string) => Profile | undefined },
): Post[] {
  const visible = posts.filter((p) => !ctx.blocked.includes(p.authorId));
  const allowed =
    tab === "following"
      ? (p: Post) => p.authorId === "me" || ctx.following[p.authorId] === "accepted"
      : (p: Post) => p.authorId === "me" || canViewProfile(ctx.profileOf(p.authorId), ctx.following);
  return visible.filter(allowed);
}

/** Adds or removes the user's like on a post. */
export function togglePostLike(post: Post, userId = "me"): Post {
  const liked = post.likes.includes(userId);
  return { ...post, likes: liked ? post.likes.filter((u) => u !== userId) : [...post.likes, userId] };
}

/** The user's most-liked artists, for the profile page. */
export function topArtists(liked: readonly Track[], limit = 6): string[] {
  const counts = new Map<string, number>();
  liked.forEach((t) => counts.set(t.artist, (counts.get(t.artist) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([artist]) => artist);
}
