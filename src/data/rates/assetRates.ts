import type { TreeType, TreeAge } from '../../features/valuation/types';

/**
 * Tree valuation rates, INR per tree, by type and age band.
 * Source: 2019 general instructions, Rule 18.
 */
export const TREE_RATES: Record<TreeType, Record<TreeAge, number> | { flat: number }> = {
  faldar: { '5': 2000, '10': 5000, above: 15000 },
  imarati: { '5': 2000, '10': 7000, above: 22000 },
  anya: { '5': 1000, '10': 4000, above: 8000 },
  bans: { flat: 100 },
};

export function getTreeRate(type: TreeType, age: TreeAge): number {
  const config = TREE_RATES[type];
  if ('flat' in config) return config.flat;
  return config[age];
}

/**
 * Other-assets fixed rates, INR per unit.
 * Source: 2019 general instructions, Rule 17. Note the rule also mentions
 * tubewells/handpumps but gives no explicit rate for them, so (as in the
 * original app) they are intentionally not included here.
 */
export const BOREWELL_RATE = 100000;
export const KUAN_RATE = 50000;
