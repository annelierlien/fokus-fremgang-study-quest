import { describe, expect, it } from "vitest";
import { ALL_PERFUMES, DROP_RATES, mysteryRates, rollOffer, rollRarity } from "./rewards";

describe("rewards", () => {
  it("has 43 perfumes", () => expect(ALL_PERFUMES.length).toBe(43));
  it("drop rates 55/25/15/5", () => {
    expect(rollRarity(DROP_RATES, () => 0.54)).toBe("common");
    expect(rollRarity(DROP_RATES, () => 0.56)).toBe("rare");
    expect(rollRarity(DROP_RATES, () => 0.81)).toBe("mythic");
    expect(rollRarity(DROP_RATES, () => 0.96)).toBe("legendary");
  });
  it("mystery box gives +5% for rare or better", () => {
    const m = mysteryRates();
    expect(m.common).toBe(50);
    expect(m.rare + m.mythic + m.legendary).toBeCloseTo(50);
  });
  it("offer = 2 distinct perfumes, 2 distinct monsters, 1 mystery", () => {
    for (let i = 0; i < 50; i++) {
      const o = rollOffer();
      const p = o.filter((x) => x.kind === "perfume");
      const m = o.filter((x) => x.kind === "monster");
      expect(o.length).toBe(5);
      expect(new Set(p.map((x) => x.name)).size).toBe(2);
      expect(new Set(m.map((x) => x.name)).size).toBe(2);
      expect(o.filter((x) => x.kind === "mystery").length).toBe(1);
    }
  });
});
