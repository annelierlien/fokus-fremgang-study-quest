import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { taskActions, useTasks } from "@/lib/store";
import { toISODate } from "@/lib/gamification";

export const Route = createFileRoute("/ny")({
  head: () => ({
    meta: [
      { title: "Ny oppgave – StudyQuest" },
      { name: "description", content: "Legg til fag, oppgave og frist." },
      { property: "og:title", content: "Ny oppgave – StudyQuest" },
      { property: "og:description", content: "Legg til fag, oppgave og frist." },
    ],
  }),
  component: AddTask,
});

function AddTask() {
  const tasks = useTasks();
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const subjects = [...new Set((tasks ?? []).map((t) => t.subject))];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !title.trim() || !deadline) {
      toast.error("Fyll ut alle feltene");
      return;
    }
    taskActions.add({ subject: subject.trim(), title: title.trim(), deadline });
    toast.success("Oppgave lagt til!");
    navigate({ to: "/oppgaver" });
  };

  const input = "w-full rounded-xl border border-input bg-card px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-ring/40";

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <h1 className="font-display text-3xl font-extrabold">Ny oppgave</h1>
      <form onSubmit={submit} className="card-soft space-y-4 p-5">
        <label className="block space-y-1">
          <span className="text-sm font-semibold">Fag</span>
          <input list="subjects" className={input} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="F.eks. Java" />
          <datalist id="subjects">{subjects.map((s) => <option key={s} value={s} />)}</datalist>
        </label>
        {subjects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {subjects.map((s) => (
              <button type="button" key={s} onClick={() => setSubject(s)} className={`rounded-full px-3 py-1 text-xs font-semibold ${subject === s ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{s}</button>
            ))}
          </div>
        )}
        <label className="block space-y-1">
          <span className="text-sm font-semibold">Oppgave</span>
          <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="F.eks. Oblig 4" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-semibold">Frist</span>
          <input type="date" min={toISODate(new Date())} className={input} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </label>
        <button type="submit" className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground shadow-glow transition hover:brightness-110">
          Legg til oppgave
        </button>
      </form>
    </div>
  );
}
