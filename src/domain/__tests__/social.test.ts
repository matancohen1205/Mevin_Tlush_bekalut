import { describe, expect, it } from "vitest";
import type { Post, Profile } from "../../types";
import { canViewProfile, initialFollowStatus, selectFeed, togglePostLike, topArtists } from "../social";
import { track } from "./fixtures";

const profile = (id: string, isPrivate = false): Profile => ({ id, handle: id, name: id, bio: "", hue: 200, isPrivate, favArtists: [] });
const post = (id: string, authorId: string): Post => ({ id, authorId, kind: "track", caption: "", createdAt: 0, likes: [], comments: [] });

describe("follow and visibility rules", () => {
  it("requires approval only for private profiles", () => {
    expect(initialFollowStatus(profile("a", true))).toBe("pending");
    expect(initialFollowStatus(profile("a"))).toBe("accepted");
  });
  it("hides private content until the follow is accepted", () => {
    const p = profile("t", true);
    expect(canViewProfile(p, {})).toBe(false);
    expect(canViewProfile(p, { t: "pending" })).toBe(false);
    expect(canViewProfile(p, { t: "accepted" })).toBe(true);
  });
});

describe("selectFeed", () => {
  const users = [profile("a"), profile("b"), profile("t", true)];
  const ctx = (following: Record<string, "accepted" | "pending">, blocked: string[] = []) => ({ following, blocked, profileOf: (id: string) => users.find((u) => u.id === id) });
  const posts = [post("1", "a"), post("2", "b"), post("3", "t"), post("4", "me")];
  it("following tab shows accepted follows and my own posts", () => {
    expect(selectFeed(posts, "following", ctx({ a: "accepted" })).map((p) => p.id)).toEqual(["1", "4"]);
  });
  it("discover tab shows public authors and skips blocked ones", () => {
    expect(selectFeed(posts, "discover", ctx({}, ["b"])).map((p) => p.id)).toEqual(["1", "4"]);
  });
});

describe("post and profile helpers", () => {
  it("toggles a like", () => {
    const liked = togglePostLike(post("1", "a"));
    expect(liked.likes).toEqual(["me"]);
    expect(togglePostLike(liked).likes).toEqual([]);
  });
  it("ranks the most-liked artists", () => {
    expect(topArtists([track("1", "X"), track("2", "Y"), track("3", "Y")], 1)).toEqual(["Y"]);
  });
});
