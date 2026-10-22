import { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { useTasks } from "@/lib/store";
import { useCollection, collectionActions } from "@/lib/collection";
import { levelFromXp, xpFromTasks } from "@/lib/gamification";
import { mysteryRates, RARITY_LABEL, rollOffer, rollPerfume, type Offer } from "@/lib/rewards";
import { Bottle, Can } from "./Bottle";

export function RewardModal() {
  const tasks = useTasks();
  const col = useCollection();
  const level = tasks ? levelFromXp(xpFromTasks(tasks)) : null;

  useEffect(() => {
    if (level !== null) collectionActions.init(level);
  }, [level]);

  if (!col || level === null || col.claimedLevel === null || level <= col.claimedLevel) return null;
  return <Picker key={col.claimedLevel} nextLevel={col.claimedLevel + 1} />;
}

function Picker({ nextLevel }: { nextLevel: number }) {
  const [offer] = useState(() => rollOffer());
  const [chosen, setChosen] = useState<Exclude<Offer, { kind: "mystery" }> | null>(null);
  const [fromMystery, setFromMystery] = useState(false);

  const choose = (o: Offer) => {
    if (o.kind === "mystery") {
      setFromMystery(true);
      setChosen({ kind: "perfume", ...rollPerfume(mysteryRates()) });
    } else setChosen(o);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-foreground/50 p-4 backdrop-blur-sm">
      <div className="card-soft w-full max-w-2xl p-5 text-center">
        <p className="text-sm font-semibold text-primary">Nivå {nextLevel} nådd! 🎉</p>
        <h2 className="font-display text-2xl font-extrabold">{chosen ? "Din belønning" : "Velg din belønning"}</h2>
        {!chosen ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {offer.map((o, i) => (
              <button key={i} onClick={() => choose(o)} className="card-soft flex flex-col items-center gap-2 p-3 transition hover:-translate-y-1 hover:shadow-glow">
                <div className="grid h-24 place-items-center">
                  {o.kind === "perfume" ? <Bottle rarity={o.rarity} /> : o.kind === "monster" ? <Can /> : <div className="mystery-box grid size-16 place-items-center font-display text-3xl font-extrabold">?</div>}
                </div>
                <p className="text-sm font-bold leading-tight">{o.kind === "mystery" ? "Mystery Box" : o.name}</p>
                <p className="text-xs text-muted-foreground">
                  {o.kind === "perfume" ? RARITY_LABEL[o.rarity] : o.kind === "monster" ? "Monster Energy" : "Økt sjanse for sjelden+"}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-5 flex flex-col items-center gap-3">
            {fromMystery && <p className="flex items-center gap-1 text-sm text-muted-foreground"><Gift className="size-4" /> Mystery Box åpnet!</p>}
            <div className="grid h-36 place-items-center">{chosen.kind === "perfume" ? <Bottle rarity={chosen.rarity} size={90} /> : <Can size={90} />}</div>
            <p className="font-display text-xl font-extrabold">{chosen.name}</p>
            <p className="text-sm text-muted-foreground">{chosen.kind === "perfume" ? RARITY_LABEL[chosen.rarity] : "Monster Energy"}</p>
            <button onClick={() => collectionActions.claim(chosen)} className="mt-2 rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground">
              Legg i samlingen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
