import { describe, expect, it } from "vitest";
import { genresLeft, toggleGenre } from "../onboarding";

describe("onboarding rules", () => {
  it("toggles genres on and off", () => {
    expect(toggleGenre([], "pop")).toEqual(["pop"]);
    expect(toggleGenre(["pop", "rock"], "pop")).toEqual(["rock"]);
  });
  it("counts how many genres are still needed", () => {
    expect(genresLeft([])).toBe(3);
    expect(genresLeft(["a", "b", "c", "d"])).toBe(0);
  });
});
