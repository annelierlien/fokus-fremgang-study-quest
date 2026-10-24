import { useSyncExternalStore } from "react";
import { addDays, toISODate, type Task } from "./gamification";

const KEY = "studyquest.v1";
let cache: Task[] | null = null;
const listeners = new Set<() => void>();

function seed(): Task[] {
  const d = new Date();
  const iso = (n: number) => toISODate(addDays(d, n));
  return [
    { id: "d1", subject: "Diskret matte", title: "Øving 5: Grafteori", deadline: iso(2), done: false },
    { id: "d2", subject: "Java", title: "Oblig 3: Arv og grensesnitt", deadline: iso(5), done: false },
    { id: "d3", subject: "Web-applikasjoner", title: "Lag React-komponent for skjema", deadline: iso(1), done: false },
    { id: "d4", subject: "Diskret matte", title: "Les kapittel 4: Induksjon", deadline: iso(0), done: false },
    { id: "d5", subject: "Java", title: "Quiz: Unntakshåndtering", deadline: iso(8), done: false },
  ];
}

function load(): Task[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as Task[]) : seed();
  } catch {
    cache = seed();
  }
  if (!localStorage.getItem(KEY)) localStorage.setItem(KEY, JSON.stringify(cache));
  return cache;
}

function save(next: Task[]) {
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Returns null during SSR / before hydration. */
export function useTasks() {
  return useSyncExternalStore(subscribe, load, () => null);
}

export const taskActions = {
  add(t: Omit<Task, "id" | "done">) {
    save([...load(), { ...t, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, done: false }]);
  },
  toggle(id: string) {
    save(load().map((t) => t.id === id ? { ...t, done: !t.done, completedAt: !t.done ? toISODate(new Date()) : undefined } : t));
  },
  remove(id: string) {
    save(load().filter((t) => t.id !== id));
  },
};
