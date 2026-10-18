import { describe, expect, it } from "vitest";
import type { SocialSnapshot } from "../../types";
import { acceptIfPending, addNotification, addPost, blockUser, countUnread, markAllRead, removeFollow, setFollow } from "../socialState";

const base = (): SocialSnapshot => ({
  me: { id: "me", handle: "me", name: "Me", bio: "", hue: 200, isPrivate: false, favArtists: [] },
  following: { a: "accepted" }, followersOfMe: [], blocked: [], posts: [], notifs: [],
});

describe("social state transitions", () => {
  it("blocking removes the follow and is idempotent", () => {
    const once = blockUser(base(), "a");
    expect(once.following).toEqual({});
    expect(blockUser(once, "a").blocked).toEqual(["a"]);
  });
  it("accepts a pending request only if it still exists", () => {
    const pending = setFollow(base(), "t", "pending");
    expect(acceptIfPending(pending, "t").following.t).toBe("accepted");
    expect(acceptIfPending(removeFollow(pending, "t"), "t").following.t).toBeUndefined();
  });
  it("adds posts and notifications at the top and tracks unread", () => {
    const withPost = addPost(base(), { kind: "track", caption: "hi" }, "p1", 10);
    expect(withPost.posts[0]).toMatchObject({ id: "p1", authorId: "me", createdAt: 10 });
    const notified = addNotification(withPost, { type: "like", actorId: "a" }, "n1", 11);
    expect(countUnread(notified)).toBe(1);
    expect(countUnread(markAllRead(notified))).toBe(0);
  });
});
