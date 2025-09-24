import { IngredientList } from './recipe.model';
import { convertUnits } from './convert-units';

export function getDisplayQty(
  item: IngredientList,
  system: 'metric' | 'imperial'
): { qty: number | null; unit: string } {
  const has = (v: any) => v !== null && v !== undefined && v !== '';
  if (system === 'metric') {
    if (has(item.metric_qty) && has(item.metric_unit)) {
      if ((item.metric_unit || '').toLowerCase() === 'count') {
        return { qty: item.metric_qty, unit: 'count' };
      }
      return { qty: item.metric_qty, unit: item.metric_unit };
    }
    if (has(item.imperial_qty) && has(item.imperial_unit)) {
      if ((item.imperial_unit || '').toLowerCase() === 'count') {
        // count cannot be converted; show as-is
        return { qty: item.imperial_qty, unit: 'count' };
      }
      // best-effort conversion, may improve later
      // try oz->g, lb->g; fl oz/cups/tsp/tbsp->ml; otherwise null
      const imperial = (item.imperial_unit || '').toLowerCase();
      const target = ['oz', 'lb'].includes(imperial) ? 'g' : 'ml';
      const converted = convertUnits(
        item.imperial_qty!,
        item.imperial_unit!,
        target
      );
      return { qty: converted, unit: converted != null ? target : '' };
    }
  } else {
    if (has(item.imperial_qty) && has(item.imperial_unit)) {
      if ((item.imperial_unit || '').toLowerCase() === 'count') {
        return { qty: item.imperial_qty, unit: 'count' };
      }
      return { qty: item.imperial_qty, unit: item.imperial_unit };
    }
    if (has(item.metric_qty) && has(item.metric_unit)) {
      if ((item.metric_unit || '').toLowerCase() === 'count') {
        return { qty: item.metric_qty, unit: 'count' };
      }
      const metric = (item.metric_unit || '').toLowerCase();
      const target = ['g', 'kg'].includes(metric) ? 'oz' : 'fl oz';
      const converted = convertUnits(
        item.metric_qty!,
        item.metric_unit!,
        target
      );
      return { qty: converted, unit: converted != null ? target : '' };
    }
  }
  return { qty: null, unit: '' };
}
