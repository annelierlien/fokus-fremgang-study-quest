import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, cleanup } from "@testing-library/react";
import { levelFromXp, xpFromTasks } from "./gamification";

beforeEach(() => {
  cleanup();
  localStorage.clear();
  vi.resetModules();
});

describe("first-start demo", () => {
  it("starts at level 1 with zero XP and no completed tasks", async () => {
    const { useTasks } = await import("./store");
    const { result } = renderHook(() => useTasks());
    const tasks = result.current ?? [];
    expect(tasks).toHaveLength(5);
    expect(tasks.every((task) => !task.done)).toBe(true);
    expect(xpFromTasks(tasks)).toBe(0);
    expect(levelFromXp(xpFromTasks(tasks))).toBe(1);
  });

  it("has enough demo tasks to reach level 2 with five checks", async () => {
    const { useTasks, taskActions } = await import("./store");
    const { result } = renderHook(() => useTasks());
    const tasks = result.current ?? [];
    act(() => {
      tasks.slice(0, 5).forEach((task) => taskActions.toggle(task.id));
    });
    expect(xpFromTasks(result.current ?? [])).toBe(500);
    expect(levelFromXp(xpFromTasks(result.current ?? []))).toBe(2);
    expect(JSON.parse(localStorage.getItem("studyquest.v1") ?? "[]").filter((task: { done: boolean }) => task.done)).toHaveLength(5);
  });

  it("preserves existing progress rather than resetting returning visitors", async () => {
    const existing = [{ id: "saved", subject: "Java", title: "Min oppgave", deadline: "2026-10-25", done: true, completedAt: "2026-10-24" }];
    localStorage.setItem("studyquest.v1", JSON.stringify(existing));
    const { useTasks } = await import("./store");
    const { result } = renderHook(() => useTasks());
    expect(result.current).toEqual(existing);
  });
});