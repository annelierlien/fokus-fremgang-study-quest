import type { Rarity } from "@/lib/rewards";

export function Bottle({ rarity, missing, size = 56 }: { rarity?: Rarity; missing?: boolean; size?: number }) {
  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <div className={`bottle-cap ${missing ? "bottle-missing" : `rarity-${rarity}`}`} style={{ width: size * 0.32, height: size * 0.22 }} />
      <div className="bottle-neck" style={{ width: size * 0.18, height: size * 0.1 }} />
      <div
        className={`bottle-body grid place-items-center ${missing ? "bottle-missing" : `rarity-${rarity}`}`}
        style={{ width: size, height: size * 0.95 }}
      >
        {missing ? <span className="font-display text-xl font-extrabold text-muted-foreground">?</span> : <span className="bottle-shine" />}
      </div>
    </div>
  );
}

export function Can({ size = 56 }: { size?: number }) {
  return <div className="monster-can" style={{ width: size * 0.62, height: size * 1.2 }} />;
}
