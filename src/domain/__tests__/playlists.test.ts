import { describe, expect, it } from "vitest";
import { addTrack, buildPlaylist, diffLibrary, playlistHash, removeTrack, reorderTracks, toggleLiked, withUuidIds } from "../playlists";
import { playlist, track } from "./fixtures";

describe("playlist operations", () => {
  it("builds with a fallback title and private visibility", () => {
    const p = buildPlaylist("  ", "New playlist", "id1", 5);
    expect(p).toMatchObject({ id: "id1", title: "New playlist", visibility: "private", createdAt: 5 });
  });
  it("does not add the same track twice", () => {
    const p = addTrack(addTrack(playlist("p"), track("a")), track("a"));
    expect(p.tracks).toHaveLength(1);
  });
  it("removes and reorders tracks", () => {
    const p = playlist("p", [track("a"), track("b"), track("c")]);
    expect(removeTrack(p, "b").tracks.map((t) => t.id)).toEqual(["a", "c"]);
    expect(reorderTracks(p, 2, 0).tracks.map((t) => t.id)).toEqual(["c", "a", "b"]);
  });
  it("toggles liked songs, newest first", () => {
    const once = toggleLiked([track("a")], track("b"));
    expect(once.map((t) => t.id)).toEqual(["b", "a"]);
    expect(toggleLiked(once, track("a")).map((t) => t.id)).toEqual(["b"]);
  });
});

describe("diffLibrary", () => {
  it("returns nothing when already in sync", () => {
    const p = playlist("p1", [track("a")]);
    const synced = { likes: new Set(["x"]), playlists: new Map([["p1", playlistHash(p)]]) };
    const d = diffLibrary(synced, [track("x")], [p]);
    expect(d).toEqual({ likesToAdd: [], likesToRemove: [], playlistsToSave: [], playlistsToDelete: [] });
  });
  it("finds additions, removals and changed playlists", () => {
    const changed = playlist("p1", [track("a"), track("b")]);
    const synced = { likes: new Set(["old"]), playlists: new Map([["p1", playlistHash(playlist("p1", [track("a")]))], ["gone", "h"]]) };
    const d = diffLibrary(synced, [track("new")], [changed, playlist("p2")]);
    expect(d.likesToAdd.map((t) => t.id)).toEqual(["new"]);
    expect(d.likesToRemove).toEqual(["old"]);
    expect(d.playlistsToSave.map((p) => p.id)).toEqual(["p1", "p2"]);
    expect(d.playlistsToDelete).toEqual(["gone"]);
  });
  it("assigns UUIDs only to ids that are not already UUIDs", () => {
    const uuid = "123e4567-e89b-12d3-a456-426614174000";
    const out = withUuidIds([playlist("pl-legacy"), playlist(uuid)], () => "new-id");
    expect(out.map((p) => p.id)).toEqual(["new-id", uuid]);
  });
});
