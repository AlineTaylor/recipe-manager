import { IngredientList } from './recipe.model';
import { convertUnits } from './convert-units';

export function getDisplayQty(
  item: IngredientList,
  system: 'metric' | 'imperial'
): { qty: number | null; unit: string } {
  if (system === 'metric') {
    if (item.metric_qty && item.metric_unit) {
      return { qty: item.metric_qty, unit: item.metric_unit };
    } else if (item.imperial_qty && item.imperial_unit) {
      // imperial to metric...
      const converted = convertUnits(
        item.imperial_qty,
        item.imperial_unit,
        'g'
      );
      return { qty: converted, unit: 'g' };
    }
  } else {
    if (item.imperial_qty && item.imperial_unit) {
      return { qty: item.imperial_qty, unit: item.imperial_unit };
    } else if (item.metric_qty && item.metric_unit) {
      // and metric to imperial!
      const converted = convertUnits(item.metric_qty, item.metric_unit, 'oz');
      return { qty: converted, unit: 'oz' };
    }
  }
  return { qty: null, unit: '' };
}
