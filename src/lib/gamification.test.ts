import { describe, expect, it } from "vitest";
import { levelFromXp, levelProgress, streak, xpFromTasks, type Task } from "./gamification";

const t = (done: boolean, completedAt?: string): Task => ({
  id: Math.random().toString(), subject: "S", title: "T", deadline: "2026-10-30", done, completedAt,
});

describe("gamification", () => {
  it("gives 100 XP per completed task", () => {
    expect(xpFromTasks([t(true, "2026-10-22"), t(false), t(true, "2026-10-21")])).toBe(200);
  });
  it("level = XP / 500 + 1", () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(499)).toBe(1);
    expect(levelFromXp(500)).toBe(2);
    expect(levelFromXp(1200)).toBe(3);
  });
  it("progress to next level", () => {
    expect(levelProgress(300)).toBeCloseTo(0.6);
  });
  it("streak counts consecutive days", () => {
    const today = new Date(2026, 9, 22);
    expect(streak([t(true, "2026-10-22"), t(true, "2026-10-21"), t(true, "2026-10-19")], today)).toBe(2);
    expect(streak([t(true, "2026-10-21"), t(true, "2026-10-20")], today)).toBe(2);
    expect(streak([t(true, "2026-10-19")], today)).toBe(0);
  });
});
