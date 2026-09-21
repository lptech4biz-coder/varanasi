/**
 * Percentage adjustments carried forward from the 2019 general instructions
 * document, since the 2026 rate list does not restate them. Each constant
 * below documents its source rule; see also `docs/ARCHITECTURE.md` and the
 * in-app "2019 Rule" badges, which point back to the same rules.
 */

/** Rule 5: boundary has more than one road -> higher-rate road, then +10%. */
export const BOUNDARY_MULTI_ROAD_MULTIPLIER = 1.1;
/** Rule 5: property fronts a park -> +10%. */
export const BOUNDARY_PARK_MULTIPLIER = 1.1;
/** Rule 5: both multi-road and park conditions together -> +15% total (not stacked). */
export const BOUNDARY_MULTI_ROAD_AND_PARK_MULTIPLIER = 1.15;

/** Rule 9: agricultural land fronting a marked segment road -> +25%. */
export const AGRI_SEGMENT_ROAD_MULTIPLIER = 1.25;
/** Rule 22: agricultural land fronting a ring road/bypass -> +25%. */
export const AGRI_RING_ROAD_MULTIPLIER = 1.25;
/** Rule 10: agricultural land already on a road, within 200m of aabadi -> +15%. */
export const AGRI_AABADI_PROXIMITY_MULTIPLIER = 1.15;

/** Rule 30: industrial land rate = 60% of the equivalent residential rate. */
export const INDUSTRIAL_RATE_FACTOR = 0.6;

/**
 * General UP Stamp Rules 1997 provision (not specific to Pindra or to any
 * one year's rate list): floor-based reduction for commercial floor rate,
 * where the ground floor carries the full rate.
 */
export const COMMERCIAL_FLOOR_DISCOUNT_PCT = {
  ground: 0,
  first: 10,
  second: 15,
  third: 20,
  fourthAndAbove: 35,
} as const;

/**
 * Rule 13: undivided land-share fraction for a partial floor/roof transfer.
 * `which` is 1 for ground floor, 2 for 1st floor, etc. The denominator is
 * `which + 1` (ground -> 1/2, 1st -> 1/3, 2nd -> 1/4, 3rd -> 1/5, and then
 * +1 to the denominator for each floor above that).
 */
export function floorShareFraction(which: number): number {
  return 1 / (which + 1);
}

/**
 * Rule 26: flat/apartment valuation = rate x super area, where super area
 * must be at least carpet-area / 0.8 (i.e. carpet area is at least 80% of
 * super area). The original rule showed a single flat rate (Rs 32,000/sq.m)
 * for Pargana Athgaon only; this migration generalises it to use the
 * village's own selected road-width rate, exactly as the source app did.
 */
export const FLAT_MIN_CARPET_TO_SUPER_RATIO = 0.8;

/** Area-unit conversion factors used by the agricultural area input. */
export const ACRE_TO_HECTARE = 0.404686;
/** "Pucca" bigha, standardised at 3025 sq. yards, per the source app's convention. */
export const BIGHA_TO_HECTARE = 0.252928;
export const SQM_PER_HECTARE = 10000;
