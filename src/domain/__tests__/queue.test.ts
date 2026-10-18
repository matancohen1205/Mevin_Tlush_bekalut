import { describe, expect, it } from "vitest";
import { cycleRepeat, moveItem, nextIndex, previousAction } from "../queue";

describe("nextIndex", () => {
  it("advances and stops at the end when repeat is off", () => {
    expect(nextIndex({ length: 3, index: 0, shuffle: false, repeat: "off" })).toBe(1);
    expect(nextIndex({ length: 3, index: 2, shuffle: false, repeat: "off" })).toBeNull();
  });
  it("wraps around with repeat all", () => {
    expect(nextIndex({ length: 3, index: 2, shuffle: false, repeat: "all" })).toBe(0);
  });
  it("never repeats the current track when shuffling", () => {
    const seq = [0.0, 0.9];
    let i = 0;
    expect(nextIndex({ length: 4, index: 0, shuffle: true, repeat: "off" }, () => seq[i++])).toBe(3);
  });
  it("returns null for an empty queue", () => {
    expect(nextIndex({ length: 0, index: -1, shuffle: false, repeat: "off" })).toBeNull();
  });
});

describe("previousAction", () => {
  it("restarts after the threshold or on the first track", () => {
    expect(previousAction(2, 10)).toEqual({ type: "restart" });
    expect(previousAction(0, 0)).toEqual({ type: "restart" });
  });
  it("goes back when the track just started", () => {
    expect(previousAction(2, 1)).toEqual({ type: "goto", index: 1 });
  });
});

describe("queue helpers", () => {
  it("cycles repeat modes", () => {
    expect(cycleRepeat("off")).toBe("all");
    expect(cycleRepeat("all")).toBe("one");
    expect(cycleRepeat("one")).toBe("off");
  });
  it("moves items without mutating the input", () => {
    const input = ["a", "b", "c"];
    expect(moveItem(input, 0, 2)).toEqual(["b", "c", "a"]);
    expect(input).toEqual(["a", "b", "c"]);
  });
});
