export type Task = {
  id: string;
  subject: string;
  title: string;
  deadline: string; // YYYY-MM-DD
  done: boolean;
  completedAt?: string; // YYYY-MM-DD
};

export const XP_PER_TASK = 100;
export const XP_PER_LEVEL = 500;

export const levelFromXp = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;
export const levelProgress = (xp: number) => (xp % XP_PER_LEVEL) / XP_PER_LEVEL;
export const xpFromTasks = (tasks: Task[]) => tasks.filter((t) => t.done).length * XP_PER_TASK;

export function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

/** Consecutive days with ≥1 completed task, ending today (or yesterday if nothing yet today). */
export function streak(tasks: Task[], today = new Date()) {
  const days = new Set(tasks.filter((t) => t.done && t.completedAt).map((t) => t.completedAt!));
  let cursor = new Date(today);
  if (!days.has(toISODate(cursor))) cursor = addDays(cursor, -1);
  let count = 0;
  while (days.has(toISODate(cursor))) {
    count++;
    cursor = addDays(cursor, -1);
  }
  return count;
}

/** Monday-based week containing `today`. */
export function weekDays(today = new Date()) {
  const offset = (today.getDay() + 6) % 7;
  const monday = addDays(today, -offset);
  return Array.from({ length: 7 }, (_, i) => toISODate(addDays(monday, i)));
}

export const sortByDeadline = (tasks: Task[]) =>
  [...tasks].sort((a, b) => a.deadline.localeCompare(b.deadline));
