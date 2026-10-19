import { describe, expect, it } from "vitest";
import { buildShareUrl, decodePayload, encodePayload, extractShareCode, fromSharedTracks, toSharePayload } from "../shareLink";
import { playlist, track } from "./fixtures";

const sample = () => toSharePayload({ ...playlist("p", [{ ...track("a"), artwork: "https://img/x.jpg", previewUrl: "https://a/x.m4a" }, { ...track("b"), artwork: "data:image/svg+xml;utf8,<svg/>" }]), title: "Road trip ✨ נסיעה" }, "Noa");

describe("share links", () => {
  it("round-trips, including non-Latin text", () => {
    const decoded = decodePayload(encodePayload(sample()));
    expect(decoded?.title).toBe("Road trip ✨ נסיעה");
    expect(decoded?.tracks.map((t) => t.id)).toEqual(["a", "b"]);
  });
  it("leaves generated (data:) covers out and recreates them on the receiving side", () => {
    const payload = sample();
    expect(payload.tracks[1].artwork).toBeUndefined();
    expect(fromSharedTracks(payload.tracks, () => "COVER")[1].artwork).toBe("COVER");
  });
  it("rejects garbage, wrong versions and empty playlists", () => {
    expect(decodePayload("not base64 !!")).toBeNull();
    expect(decodePayload(btoa(JSON.stringify({ v: 2, tracks: [] })))).toBeNull();
    expect(decodePayload(encodePayload({ ...sample(), tracks: [] }))).toBeNull();
  });
  it("drops unsafe URLs from untrusted input", () => {
    const evil = { ...sample(), tracks: [{ id: "x", title: "t", artist: "a", durationMs: 1000, source: "itunes" as const, previewUrl: "javascript:alert(1)", artwork: "http://insecure/x.png", sourceUrl: "file:///etc/passwd" }] };
    const [t] = decodePayload(encodePayload(evil))!.tracks;
    expect(t.previewUrl).toBeUndefined();
    expect(t.artwork).toBeUndefined();
    expect(t.sourceUrl).toBeUndefined();
  });
  it("builds a URL and reads the code back", () => {
    const url = buildShareUrl("https://app.test/", sample());
    expect(extractShareCode(url.slice(url.indexOf("?")))).toBe(encodePayload(sample()));
    expect(extractShareCode("?other=1")).toBeNull();
  });
});
