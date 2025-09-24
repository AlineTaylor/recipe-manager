import { convertUnits } from './convert-units';

describe('convertUnits', () => {
  it('converts mass correctly', () => {
    expect(convertUnits(1000, 'g', 'kg')).toBe(1);
    expect(convertUnits(1, 'lb', 'oz')).toBeCloseTo(16, 2);
  });

  it('converts volume correctly', () => {
    expect(convertUnits(1, 'l', 'ml')).toBe(1000);
    expect(convertUnits(1, 'cups', 'ml')).toBeCloseTo(236.59, 2);
    expect(convertUnits(8, 'fl oz', 'cups')).toBeCloseTo(1, 2);
  });

  it('returns identity for same units', () => {
    expect(convertUnits(5, 'g', 'g')).toBe(5);
  });

  it('does not convert to/from count (non-identity)', () => {
    expect(convertUnits(5, 'count', 'count')).toBe(5);
    expect(convertUnits(5, 'count', 'g')).toBeNull();
    expect(convertUnits(5, 'ml', 'count')).toBeNull();
  });

  it('returns null for cross-dimension conversions', () => {
    expect(convertUnits(5, 'g', 'ml')).toBeNull();
    expect(convertUnits(5, 'cups', 'oz')).toBeNull(); // volume vs mass
  });
});
