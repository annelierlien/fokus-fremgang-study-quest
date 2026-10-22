import { createFileRoute } from "@tanstack/react-router";
import { useCollection } from "@/lib/collection";
import { ALL_PERFUMES, RARITIES, RARITY_LABEL } from "@/lib/rewards";
import { Bottle } from "@/components/Bottle";

export const Route = createFileRoute("/samling")({
  head: () => ({
    meta: [
      { title: "Samlingen min – StudyQuest" },
      { name: "description", content: "Se parfymene du har samlet ved å gå opp i nivå i StudyQuest." },
      { property: "og:title", content: "Samlingen min – StudyQuest" },
      { property: "og:description", content: "Parfymehylla di i StudyQuest." },
    ],
  }),
  component: Samling,
});

function Samling() {
  const col = useCollection();
  if (!col) return <div className="h-64" />;
  const owned = new Set(col.perfumes);
  const count = ALL_PERFUMES.filter((p) => owned.has(p.name)).length;

  return (
    <div className="space-y-6">
      <section className="card-soft p-5">
        <h1 className="font-display text-2xl font-extrabold">Samlingen min</h1>
        <p className="mt-1 font-semibold">{count}/{ALL_PERFUMES.length} samlet</p>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(count / ALL_PERFUMES.length) * 100}%` }} />
        </div>
        {col.monsters.length > 0 && <p className="mt-3 text-sm text-muted-foreground">Monster Energy valgt: {col.monsters.length}</p>}
      </section>

      <section className="card-soft p-5">
        <h2 className="font-display text-lg font-bold">Parfymehylla</h2>
        {RARITIES.map((r) => (
          <div key={r} className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{RARITY_LABEL[r]}</p>
            <div className="shelf mt-2 grid grid-cols-4 gap-3 pb-2 sm:grid-cols-6">
              {ALL_PERFUMES.filter((p) => p.rarity === r).map((p) => {
                const has = owned.has(p.name);
                return (
                  <div key={p.name} className="flex flex-col items-center gap-1 text-center">
                    <Bottle rarity={p.rarity} missing={!has} size={44} />
                    <span className="text-[11px] font-semibold leading-tight">{has ? p.name : "???"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
