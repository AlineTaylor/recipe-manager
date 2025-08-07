export function convertUnits(
  qty: number,
  fromUnit: string,
  toUnit: string
): number | null {
  const conversions: Record<string, Record<string, number>> = {
    g: { oz: 0.035274 },
    oz: { g: 28.3495 },
    ml: { 'fl oz': 0.033814 },
    'fl oz': { ml: 29.5735 },
  };

  if (fromUnit === 'count' || toUnit === 'count' || fromUnit === toUnit) {
    return qty; // no conversion needed
  }

  const multiplier = conversions[fromUnit]?.[toUnit];
  if (!multiplier) return null;

  return +(qty * multiplier).toFixed(2); // round to 2 decimal places
}
