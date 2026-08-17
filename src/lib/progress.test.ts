import { describe, expect, it } from "vitest";
import { buildConsistencyGrid, currentStreak, localDateKey, progressForPlan } from "./progress";

describe("progress helpers", () => {
  it("marks fire on days with a solve and sleep otherwise", () => {
    const today = new Date(2026, 7, 17);
    const grid = buildConsistencyGrid(["2026-08-17", "2026-08-15"], { days: 5, today });
    expect(grid.map((cell) => cell.emoji)).toEqual(["💤", "💤", "🔥", "💤", "🔥"]);
    expect(grid.at(-1)?.isToday).toBe(true);
  });

  it("counts a streak through today", () => {
    const today = new Date(2026, 7, 17);
    expect(currentStreak(["2026-08-16", "2026-08-17"], today)).toBe(2);
    expect(currentStreak(["2026-08-16"], today)).toBe(1);
    expect(currentStreak(["2026-08-14"], today)).toBe(0);
  });

  it("limits progress totals for free vs plus", () => {
    expect(progressForPlan(10, false, 8, 6)).toEqual({ solved: 8, total: 8, percent: 100 });
    expect(progressForPlan(10, true, 8, 6)).toEqual({ solved: 10, total: 14, percent: 71 });
  });

  it("formats local date keys", () => {
    expect(localDateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});
