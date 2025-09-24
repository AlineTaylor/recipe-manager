// Dimension-aware conversion utility with a small, explicit unit set.
// Supported dimensions and units:
// - mass: g, kg, oz, lb
// - volume: ml, l, fl oz, cups, tsp, tbsp
// - count: special-cased (no-op)
export function convertUnits(qty: number, fromUnit: string, toUnit: string): number | null {
  if (qty == null || isNaN(qty as any)) return null;
  if (!fromUnit || !toUnit) return null;
  if (fromUnit === toUnit) return qty;

  const MASS = new Set(['g', 'kg', 'oz', 'lb']);
  const VOLUME = new Set(['ml', 'l', 'fl oz', 'cups', 'tsp', 'tbsp']);

  const norm = (u: string) => u.trim().toLowerCase();
  const f = norm(fromUnit);
  const t = norm(toUnit);

  // normalize spelling for multi-word units
  const unitAlias: Record<string, string> = {
    'fl oz': 'fl oz',
    'floz': 'fl oz',
    'fluid ounce': 'fl oz',
    'fluid ounces': 'fl oz',
  };
  const resolve = (u: string) => unitAlias[u] || u;

  const fu = resolve(f);
  const tu = resolve(t);

  // Special-case 'count': only identity is valid
  if (fu === 'count' && tu === 'count') return qty;
  if (fu === 'count' || tu === 'count') return null;

  const isMass = MASS.has(fu) && MASS.has(tu);
  const isVolume = VOLUME.has(fu) && VOLUME.has(tu);
  if (!isMass && !isVolume) return null;

  // Convert via a metric base for each dimension for simplicity
  // Mass base: grams (g)
  // Volume base: milliliters (ml)

  const toBaseMass: Record<string, number> = {
    g: 1,
    kg: 1000,
    oz: 28.349523125,
    lb: 453.59237,
  };
  const fromBaseMass: Record<string, number> = {
    g: 1,
    kg: 1 / 1000,
    oz: 1 / 28.349523125,
    lb: 1 / 453.59237,
  };

  const toBaseVol: Record<string, number> = {
    ml: 1,
    l: 1000,
    'fl oz': 29.5735295625,
    cups: 236.5882365, // US legal cup
    tbsp: 14.78676478125,
    tsp: 4.92892159375,
  };
  const fromBaseVol: Record<string, number> = {
    ml: 1,
    l: 1 / 1000,
    'fl oz': 1 / 29.5735295625,
    cups: 1 / 236.5882365,
    tbsp: 1 / 14.78676478125,
    tsp: 1 / 4.92892159375,
  };

  let baseQty: number;
  if (isMass) {
    const m1 = toBaseMass[fu];
    const m2 = fromBaseMass[tu];
    if (m1 == null || m2 == null) return null;
    baseQty = qty * m1; // to grams
    const res = baseQty * m2; // to target
    return +res.toFixed(2);
  }

  if (isVolume) {
    const v1 = toBaseVol[fu];
    const v2 = fromBaseVol[tu];
    if (v1 == null || v2 == null) return null;
    baseQty = qty * v1; // to ml
    const res = baseQty * v2; // to target
    return +res.toFixed(2);
  }

  return null;
}
