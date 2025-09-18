import { getDisplayQty } from './get-display-qty';
import { IngredientList } from './recipe.model';

describe('getDisplayQty', () => {
  const base: Partial<IngredientList> = { id: 1, ingredient_id: 1 } as any;

  it('shows count unchanged in either system', () => {
    const item = { ...base, metric_qty: 3, metric_unit: 'count' } as any;
    expect(getDisplayQty(item, 'metric')).toEqual({ qty: 3, unit: 'count' });
    expect(getDisplayQty(item, 'imperial')).toEqual({ qty: 3, unit: 'count' });
  });

  it('converts mass when needed', () => {
    const item = { ...base, metric_qty: 1000, metric_unit: 'g' } as any;
    const imp = getDisplayQty(item, 'imperial');
    expect(imp.unit).toBe('oz');
    expect(imp.qty).toBeCloseTo(35.27, 2);
  });

  it('converts volume when needed', () => {
    const item = { ...base, imperial_qty: 2, imperial_unit: 'cups' } as any;
    const met = getDisplayQty(item, 'metric');
    expect(met.unit).toBe('ml');
    expect(met.qty).toBeCloseTo(473.18, 2);
  });
});
