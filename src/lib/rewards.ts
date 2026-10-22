export type Rarity = "common" | "rare" | "mythic" | "legendary";

export const RARITIES: Rarity[] = ["common", "rare", "mythic", "legendary"];
export const RARITY_LABEL: Record<Rarity, string> = {
  common: "Vanlig",
  rare: "Sjelden",
  mythic: "Mytisk",
  legendary: "Legendarisk",
};

export const PERFUMES: Record<Rarity, string[]> = {
  common: ["Missing Person", "11 11", "Glossier You", "Not A Perfume", "Pear Inc", "Commodity Milk", "Milk", "Boujee Marshmallow", "Vanilla Skin", "Sun Fruit", "Rose Whip", "Blanche"],
  rare: ["Libre", "Miss Dior", "Good Girl", "Flowerbomb", "Flora", "Her Intense", "Mademoiselle", "Paradox", "Goddess", "Devotion", "Fleur de Peau", "Musc Rose Noir"],
  mythic: ["Black Opium", "Vanilla 28", "Delina", "Mojave Ghost", "Gypse Water", "Gris Charnel", "Blanche Bete", "Angel Dust", "Moon Glory", "Impadia", "Red Dacota"],
  legendary: ["Guidance", "Angels Share", "Lost Cherry", "Tobacco Vanille", "Love Don't Be Shy", "Babycat", "Cruz Del Sur 2", "Casablanca Lily"],
};

export const ALL_PERFUMES = RARITIES.flatMap((rarity) => PERFUMES[rarity].map((name) => ({ name, rarity })));

export const DROP_RATES: Record<Rarity, number> = { common: 55, rare: 25, mythic: 15, legendary: 5 };

/** Mystery Box: +5 percentage points total for Rare or better, spread proportionally. */
export function mysteryRates(): Record<Rarity, number> {
  const better = DROP_RATES.rare + DROP_RATES.mythic + DROP_RATES.legendary;
  const k = (better + 5) / better;
  return {
    common: DROP_RATES.common - 5,
    rare: DROP_RATES.rare * k,
    mythic: DROP_RATES.mythic * k,
    legendary: DROP_RATES.legendary * k,
  };
}

type Rng = () => number;

export function rollRarity(rates: Record<Rarity, number>, rng: Rng = Math.random): Rarity {
  const total = RARITIES.reduce((s, r) => s + rates[r], 0);
  let x = rng() * total;
  for (const r of RARITIES) {
    if (x < rates[r]) return r;
    x -= rates[r];
  }
  return "legendary";
}

const pick = <T,>(arr: T[], rng: Rng) => arr[Math.floor(rng() * arr.length)]!;

export function rollPerfume(rates = DROP_RATES, rng: Rng = Math.random, exclude: string[] = []) {
  const rarity = rollRarity(rates, rng);
  const pool = PERFUMES[rarity].filter((n) => !exclude.includes(n));
  return { name: pick(pool.length ? pool : PERFUMES[rarity], rng), rarity };
}

export type Offer =
  | { kind: "perfume"; name: string; rarity: Rarity }
  | { kind: "mystery" };

export function rollOffer(rng: Rng = Math.random): Offer[] {
  const p1 = rollPerfume(DROP_RATES, rng);
  const p2 = rollPerfume(DROP_RATES, rng, [p1.name]);
  const p3 = rollPerfume(DROP_RATES, rng, [p1.name, p2.name]);
  return [
    { kind: "perfume", ...p1 },
    { kind: "perfume", ...p2 },
    { kind: "perfume", ...p3 },
    { kind: "mystery" },
  ];
}

export const rarityOf = (name: string) => ALL_PERFUMES.find((p) => p.name === name)?.rarity;
