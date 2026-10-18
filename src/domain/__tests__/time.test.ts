import { describe, expect, it } from "vitest";
import { formatClock, percentOf, relativeTime } from "../time";

describe("time helpers", () => {
  it("formats clock values", () => {
    expect(formatClock(75)).toBe("1:15");
    expect(formatClock(5.9)).toBe("0:05");
    expect(formatClock(-3)).toBe("0:00");
  });
  it("clamps percentages", () => {
    expect(percentOf(30, 60)).toBe(50);
    expect(percentOf(5, 0)).toBe(0);
    expect(percentOf(200, 100)).toBe(100);
  });
  it("describes relative time in minutes, hours and days", () => {
    const now = 1_000_000_000_000;
    expect(relativeTime(now - 5 * 60_000, "en-US", now)).toMatch(/5 min/);
    expect(relativeTime(now - 3 * 3_600_000, "en-US", now)).toMatch(/3 hr/);
    expect(relativeTime(now - 2 * 86_400_000, "en-US", now)).toMatch(/2 days/);
  });
});
