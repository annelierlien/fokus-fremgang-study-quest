import { Check, Trash2 } from "lucide-react";
import { taskActions } from "@/lib/store";
import { toISODate, type Task } from "@/lib/gamification";
import { toast } from "sonner";

function deadlineLabel(deadline: string) {
  const today = new Date(toISODate(new Date()));
  const diff = Math.round((new Date(deadline).getTime() - today.getTime()) / 86400000);
  if (diff < 0) return { text: `${-diff} d over frist`, urgent: true };
  if (diff === 0) return { text: "I dag", urgent: true };
  if (diff === 1) return { text: "I morgen", urgent: true };
  return { text: `Om ${diff} dager`, urgent: false };
}

export function TaskItem({ task }: { task: Task }) {
  const dl = deadlineLabel(task.deadline);
  return (
    <li className={`card-soft flex items-center gap-3 p-4 transition ${task.done ? "opacity-60" : ""}`}>
      <button
        aria-label={task.done ? "Marker som ikke ferdig" : "Marker som ferdig"}
        onClick={() => {
          if (!task.done) toast.success("+100 XP! Godt jobba 🎉");
          taskActions.toggle(task.id);
        }}
        className={`grid size-9 shrink-0 place-items-center rounded-full border-2 transition ${
          task.done ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
        }`}
      >
        {task.done && <Check className="size-5" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{task.subject}</p>
        <p className={`truncate font-medium ${task.done ? "line-through" : ""}`}>{task.title}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(task.deadline).toLocaleDateString("nb-NO", { weekday: "short", day: "numeric", month: "short" })}
          {!task.done && (
            <span className={`ml-2 rounded-full px-2 py-0.5 ${dl.urgent ? "bg-xp/25 text-foreground" : "bg-muted"}`}>{dl.text}</span>
          )}
        </p>
      </div>
      <button
        aria-label="Slett oppgave"
        onClick={() => taskActions.remove(task.id)}
        className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}
