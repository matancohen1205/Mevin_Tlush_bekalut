import { describe, expect, it } from "vitest";
import { sanitizeHandle, isProfileValid } from "../profile";
import { buildPost, canPublish, defaultShareKind, shareableTracks } from "../posts";
import { playlist, track } from "./fixtures";

describe("shareableTracks", () => {
  it("puts the playing song first without duplicating it", () => {
    const out = shareableTracks(track("a"), [track("b"), track("a")]);
    expect(out.map((t) => t.id)).toEqual(["a", "b"]);
  });
});

describe("share defaults and validation", () => {
  it("preselects playlists only when nothing is playing and one exists", () => {
    expect(defaultShareKind(track("a"), [playlist("p")])).toBe("track");
    expect(defaultShareKind(null, [playlist("p")])).toBe("playlist");
    expect(defaultShareKind(null, [])).toBe("track");
  });
  it("needs a song or a non-empty playlist", () => {
    expect(canPublish("track", null, undefined)).toBe(false);
    expect(canPublish("playlist", null, playlist("p"))).toBe(false);
    expect(canPublish("playlist", null, playlist("p", [track("a")]))).toBe(true);
  });
});

describe("buildPost", () => {
  it("turns an uncaptioned now-playing share into a now_playing card", () => {
    expect(buildPost("track", track("a"), undefined, "  ", "a")?.kind).toBe("now_playing");
    expect(buildPost("track", track("a"), undefined, "hi", "a")?.kind).toBe("track");
  });
  it("shares a playlist snapshot and rejects empty input", () => {
    expect(buildPost("playlist", null, playlist("p", [track("a")]), "")?.playlist?.tracks).toHaveLength(1);
    expect(buildPost("track", null, undefined, "")).toBeNull();
  });
});

describe("profile form", () => {
  it("strips illegal handle characters", () => {
    expect(sanitizeHandle(" a b!c.d_e ")).toBe("abc.d_e");
    expect(isProfileValid("Name", "!!!")).toBe(false);
    expect(isProfileValid("Name", "ok")).toBe(true);
  });
});
