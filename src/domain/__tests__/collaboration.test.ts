import { describe, expect, it } from "vitest";
import { addTrackAs, canEdit, invitablePeople, inviteCollaborator, isCollaborative, removeCollaborator, withCollaborationDefaults } from "../collaboration";
import { playlist, track } from "./fixtures";

describe("collaboration rules", () => {
  it("adds defaults to playlists saved before collaboration existed", () => {
    const old = { id: "p", title: "t", description: "", visibility: "private" as const, tracks: [], createdAt: 1 };
    expect(withCollaborationDefaults(old)).toMatchObject({ collaborators: [], addedBy: {} });
  });
  it("invites once and never invites the owner", () => {
    const p = inviteCollaborator(inviteCollaborator(playlist("p"), "noa"), "noa");
    expect(p.collaborators).toEqual(["noa"]);
    expect(inviteCollaborator(playlist("p"), "me").collaborators).toEqual([]);
    expect(isCollaborative(p)).toBe(true);
  });
  it("lets only the owner and collaborators add songs", () => {
    const p = inviteCollaborator(playlist("p"), "noa");
    expect(canEdit(p, "noa")).toBe(true);
    expect(canEdit(p, "stranger")).toBe(false);
    expect(addTrackAs(p, track("a"), "stranger").tracks).toHaveLength(0);
  });
  it("records who added each song on collaborative playlists only", () => {
    const shared = addTrackAs(inviteCollaborator(playlist("p"), "noa"), track("a"), "noa");
    expect(shared.addedBy).toEqual({ a: "noa" });
    expect(addTrackAs(playlist("solo"), track("a")).addedBy).toEqual({});
  });
  it("removes collaborators but keeps their songs, and filters invitable people", () => {
    const p = removeCollaborator(addTrackAs(inviteCollaborator(playlist("p"), "noa"), track("a"), "noa"), "noa");
    expect(p.collaborators).toEqual([]);
    expect(p.tracks).toHaveLength(1);
    const people = [{ id: "noa" }, { id: "yuki" }] as never[];
    expect(invitablePeople(people, inviteCollaborator(playlist("p"), "noa")).map((x: { id: string }) => x.id)).toEqual(["yuki"]);
  });
});
