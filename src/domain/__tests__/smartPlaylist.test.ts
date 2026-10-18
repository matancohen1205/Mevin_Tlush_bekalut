import { describe, expect, it } from "vitest";
import { interleaveTracks, termsFromPrompt, titleFromPrompt } from "../smartPlaylist";
import { track } from "./fixtures";

describe("termsFromPrompt", () => {
  it("maps English and Hebrew keywords to search terms", () => {
    expect(termsFromPrompt("night drive with mellow rock")).toEqual(expect.arrayContaining(["ambient sleep", "road trip", "rock"]));
    expect(termsFromPrompt("ג׳אז רומנטי")).toEqual(["jazz", "love songs"]);
  });
  it("falls back to the raw text and caps the number of terms", () => {
    expect(termsFromPrompt("  xyz  ")).toEqual(["xyz"]);
    expect(termsFromPrompt("rock pop jazz sad happy").length).toBe(3);
  });
});

describe("interleaveTracks", () => {
  it("alternates between lists and removes duplicates", () => {
    const out = interleaveTracks([[track("a"), track("b")], [track("c"), track("a")]]);
    expect(out.map((t) => t.id)).toEqual(["a", "c", "b"]);
  });
  it("respects the limit and handles empty input", () => {
    expect(interleaveTracks([[track("a"), track("b")]], 1)).toHaveLength(1);
    expect(interleaveTracks([])).toEqual([]);
  });
});

describe("titleFromPrompt", () => {
  it("shortens long descriptions", () => {
    expect(titleFromPrompt("a".repeat(50))).toHaveLength(31);
    expect(titleFromPrompt(" short ")).toBe("short");
  });
});
