import { useSyncExternalStore } from "react";

const KEY = "studyquest.rewards.v1";
export type Collection = { claimedLevel: number | null; perfumes: string[] };
let cache: Collection | null = null;
const listeners = new Set<() => void>();

function load(): Collection {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as Collection) : { claimedLevel: null, perfumes: [] };
  } catch {
    cache = { claimedLevel: null, perfumes: [] };
  }
  return cache;
}

function save(next: Collection) {
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useCollection() {
  return useSyncExternalStore(subscribe, load, () => null);
}

export const collectionActions = {
  /** First run: current level counts as already claimed (no reward for demo data). */
  init(level: number) {
    const c = load();
    if (c.claimedLevel === null) save({ ...c, claimedLevel: level });
  },
  claim(reward: { name: string }) {
    const c = load();
    save({
      claimedLevel: (c.claimedLevel ?? 1) + 1,
      perfumes: !c.perfumes.includes(reward.name) ? [...c.perfumes, reward.name] : c.perfumes,
    });
  },
};
