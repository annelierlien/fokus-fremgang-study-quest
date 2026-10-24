import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Star, Trophy, ListChecks } from "lucide-react";
import { useTasks } from "@/lib/store";
import { levelFromXp, levelProgress, sortByDeadline, streak, toISODate, weekDays, xpFromTasks, XP_PER_LEVEL } from "@/lib/gamification";
import { TaskItem } from "@/components/TaskItem";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashbord – StudyQuest" },
      { name: "description", content: "Se XP, nivå, streak og ukens oppgaver i StudyQuest." },
      { property: "og:title", content: "Dashbord – StudyQuest" },
      { property: "og:description", content: "Gamifisert studieplanlegger for studenter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const DAY_LABELS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

function Dashboard() {
  const tasks = useTasks();
  if (!tasks) return <div className="h-64" />;

  const xp = xpFromTasks(tasks);
  const level = levelFromXp(xp);
  const week = weekDays();
  const today = toISODate(new Date());
  const doneThisWeek = tasks.filter((t) => t.done && t.completedAt && week.includes(t.completedAt)).length;
  const perDay = week.map((d) => tasks.filter((t) => t.done && t.completedAt === d).length);
  const max = Math.max(1, ...perDay);
  const weekTasks = sortByDeadline(tasks.filter((t) => week.includes(t.deadline) || (!t.done && t.deadline < (week[0] ?? ""))));

  return (
    <div className="space-y-6">
      <section className="card-hero p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm opacity-80">Ditt nivå</p>
            <p className="font-display text-5xl font-extrabold">Nivå {level}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-xp px-3 py-1.5 font-bold text-xp-foreground">
            <Flame className="size-4" /> {streak(tasks)} dager
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-1 flex justify-between text-sm font-semibold">
            <span>{xp % XP_PER_LEVEL} / {XP_PER_LEVEL} XP</span>
            <span>til nivå {level + 1}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-primary-foreground/20">
            <div className="h-full rounded-full bg-xp transition-all duration-700" style={{ width: `${levelProgress(xp) * 100}%` }} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={<ListChecks />} label="Totalt oppgaver" value={tasks.length} />
        <Stat icon={<Trophy />} label="Fullført denne uka" value={doneThisWeek} />
        <Stat icon={<Star />} label="XP" value={xp} />
        <Stat icon={<Flame />} label="Streak" value={`${streak(tasks)} d`} />
      </section>

      <section className="card-soft p-5">
        <h2 className="font-display text-lg font-bold">Ukens aktivitet</h2>
        <div className="mt-4 flex h-32 items-end gap-2">
          {perDay.map((n, i) => (
            <div key={week[i]} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-semibold">{n || ""}</span>
              <div
                className={`w-full rounded-lg ${n ? "bg-primary" : "bg-muted"}`}
                style={{ height: `${Math.max(8, (n / max) * 80)}px` }}
              />
              <span className={`text-xs ${week[i] === today ? "font-bold text-primary" : "text-muted-foreground"}`}>{DAY_LABELS[i]}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Denne ukas oppgaver</h2>
          <Link to="/oppgaver" className="text-sm font-semibold text-primary">Se alle →</Link>
        </div>
        {weekTasks.length ? (
          <ul className="space-y-2">{weekTasks.map((t) => <TaskItem key={t.id} task={t} />)}</ul>
        ) : (
          <p className="card-soft p-5 text-muted-foreground">Ingen frister denne uka. <Link to="/ny" className="font-semibold text-primary">Legg til en oppgave</Link></p>
        )}
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="card-soft p-4">
      <div className="text-primary [&_svg]:size-5">{icon}</div>
      <p className="mt-2 font-display text-2xl font-extrabold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
