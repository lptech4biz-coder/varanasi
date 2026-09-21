import { ACRE_TO_HECTARE, BIGHA_TO_HECTARE, SQM_PER_HECTARE } from '../../../data/rates/bonusRules';
import type { AgriUnit } from '../types';

/** Convert an agricultural area, given in `unit`, to hectares. */
export function toHectares(area: number, unit: AgriUnit): number {
  switch (unit) {
    case 'ha':
      return area;
    case 'sqm':
      return area / SQM_PER_HECTARE;
    case 'acre':
      return area * ACRE_TO_HECTARE;
    case 'bigha':
      return area * BIGHA_TO_HECTARE;
  }
}
