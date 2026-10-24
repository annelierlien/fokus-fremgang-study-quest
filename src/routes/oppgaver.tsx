import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTasks } from "@/lib/store";
import { sortByDeadline } from "@/lib/gamification";
import { TaskItem } from "@/components/TaskItem";

export const Route = createFileRoute("/oppgaver")({
  head: () => ({
    meta: [
      { title: "Mine oppgaver – StudyQuest" },
      { name: "description", content: "Alle oppgavene dine sortert etter frist." },
      { property: "og:title", content: "Mine oppgaver – StudyQuest" },
      { property: "og:description", content: "Alle oppgavene dine sortert etter frist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tasks,
});

const FILTERS = [
  { key: "all", label: "Alle" },
  { key: "active", label: "Aktive" },
  { key: "done", label: "Ferdige" },
] as const;

function Tasks() {
  const tasks = useTasks();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  if (!tasks) return <div className="h-64" />;
  const list = sortByDeadline(tasks).filter((t) => filter === "all" || (filter === "done" ? t.done : !t.done));

  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl font-extrabold">Mine oppgaver</h1>
      <div className="inline-flex rounded-full bg-muted p-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${filter === f.key ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {list.length ? (
        <ul className="space-y-2">{list.map((t) => <TaskItem key={t.id} task={t} />)}</ul>
      ) : (
        <p className="card-soft p-5 text-muted-foreground">Ingen oppgaver her. <Link to="/ny" className="font-semibold text-primary">Legg til en</Link></p>
      )}
    </div>
  );
}
