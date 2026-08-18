import { describe, expect, it } from "vitest";
import { buildConsistencyGrid, currentStreak, localDateKey, progressForPlan, solvesThisWeek, topicProgress } from "./progress";

describe("progress helpers", () => {
  it("marks fire on days with a solve and sleep otherwise", () => {
    const today = new Date(2026, 7, 18);
    const grid = buildConsistencyGrid(["2026-08-18", "2026-08-16"], { days: 5, today });
    expect(grid.map((cell) => cell.emoji)).toEqual(["💤", "💤", "🔥", "💤", "🔥"]);
    expect(grid.at(-1)?.isToday).toBe(true);
  });

  it("counts a streak through today", () => {
    const today = new Date(2026, 7, 18);
    expect(currentStreak(["2026-08-17", "2026-08-18"], today)).toBe(2);
    expect(currentStreak(["2026-08-17"], today)).toBe(1);
    expect(currentStreak(["2026-08-15"], today)).toBe(0);
  });

  it("counts unique practice days in the current week", () => {
    const tuesday = new Date(2026, 7, 18);
    expect(solvesThisWeek(["2026-08-16", "2026-08-18", "2026-08-10"], tuesday)).toBe(2);
  });

  it("limits progress totals for free vs plus", () => {
    expect(progressForPlan(10, false, 8, 6)).toEqual({ solved: 8, total: 8, percent: 100 });
    expect(progressForPlan(10, true, 8, 6)).toEqual({ solved: 10, total: 14, percent: 71 });
  });

  it("groups topic progress for the current plan", () => {
    const catalog = [
      { id: 1, topic: "Arrays", isPlus: false },
      { id: 2, topic: "Arrays", isPlus: false },
      { id: 3, topic: "Graphs", isPlus: true },
    ];
    expect(topicProgress(catalog, [1, 3], "free")).toEqual([
      { topic: "Arrays", solved: 1, total: 2, percent: 50 },
    ]);
    expect(topicProgress(catalog, [1, 3], "plus")).toEqual([
      { topic: "Arrays", solved: 1, total: 2, percent: 50 },
      { topic: "Graphs", solved: 1, total: 1, percent: 100 },
    ]);
  });

  it("formats local date keys", () => {
    expect(localDateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});
