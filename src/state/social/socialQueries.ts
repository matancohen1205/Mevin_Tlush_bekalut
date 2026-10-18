/** Read-only questions about the community snapshot (profiles, counters, visibility). */
import { SEED_USERS } from "../../data/seed";
import { canViewProfile } from "../../domain/social";
import { countUnread } from "../../domain/socialState";
import { DEMO_TRACKS } from "../../services/music/demo";
import type { Profile, SocialSnapshot } from "../../types";
import type { SharedPlaylistView } from "./SocialContext";

/** Builds the query functions for a snapshot. */
export function createQueries(s: SocialSnapshot) {
  /** Profile of the current user or of a seeded community member. */
  const profileOf = (id: string): Profile | undefined => (id === "me" ? s.me : SEED_USERS.find((u) => u.id === id));

  return {
    profileOf,
    followersCount: (id: string): number =>
      id === "me" ? s.followersOfMe.length : (SEED_USERS.find((u) => u.id === id)?.baseFollowers ?? 0) + (s.following[id] === "accepted" ? 1 : 0),
    followingCount: (id: string): number => (id === "me" ? Object.keys(s.following).length : 20 + id.length),
    canSee: (id: string): boolean => canViewProfile(profileOf(id), s.following),
    playlistsOf: (id: string): SharedPlaylistView[] =>
      (SEED_USERS.find((u) => u.id === id)?.playlists ?? []).map((p) => ({ title: p.title, description: p.description, tracks: p.idx.map((i) => DEMO_TRACKS[i]) })),
    unread: countUnread(s),
  };
}
