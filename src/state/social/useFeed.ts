/** The posts for a feed tab, plus the people the user is not following yet. */
import { useMemo } from "react";
import { SEED_USERS, type SeedUser } from "../../data/seed";
import { selectFeed, type FeedTab } from "../../domain/social";
import type { Post } from "../../types";
import { useSocial } from "./SocialContext";

/** Feed posts for `tab`, and follow suggestions (people not followed or blocked). */
export function useFeed(tab: FeedTab): { posts: Post[]; suggestions: SeedUser[] } {
  const { posts, following, blocked, profileOf } = useSocial();
  return useMemo(
    () => ({
      posts: selectFeed(posts, tab, { following, blocked, profileOf }),
      suggestions: SEED_USERS.filter((u) => !following[u.id] && !blocked.includes(u.id)),
    }),
    [posts, tab, following, blocked, profileOf],
  );
}
