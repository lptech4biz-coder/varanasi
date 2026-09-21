import {
  BOUNDARY_MULTI_ROAD_MULTIPLIER,
  BOUNDARY_PARK_MULTIPLIER,
  BOUNDARY_MULTI_ROAD_AND_PARK_MULTIPLIER,
  AGRI_SEGMENT_ROAD_MULTIPLIER,
  AGRI_RING_ROAD_MULTIPLIER,
  AGRI_AABADI_PROXIMITY_MULTIPLIER,
  INDUSTRIAL_RATE_FACTOR,
  FLAT_MIN_CARPET_TO_SUPER_RATIO,
  floorShareFraction,
} from '../../../data/rates/bonusRules';
import { getConstructionRate } from '../../../data/rates/constructionRates';
import { getTreeRate, BOREWELL_RATE, KUAN_RATE } from '../../../data/rates/assetRates';
import { toHectares } from '../utils/unitConversion';
import type {
  BoundaryBonusKind,
  BoundaryConditions,
  CalculationSection,
  ValuationInput,
  ValuationResult,
} from '../types';

/**
 * Resolve the boundary-condition multiplier and which bonus (if any) applied.
 * Source: 2019 general instructions, Rule 5. The two conditions combined
 * give a flat +15%, not the product of the two individual +10% bonuses.
 */
export function resolveBoundaryBonus(boundary: BoundaryConditions): {
  multiplier: number;
  kind: BoundaryBonusKind;
} {
  if (boundary.multiRoad && boundary.park) {
    return { multiplier: BOUNDARY_MULTI_ROAD_AND_PARK_MULTIPLIER, kind: 'both' };
  }
  if (boundary.multiRoad) {
    return { multiplier: BOUNDARY_MULTI_ROAD_MULTIPLIER, kind: 'multiRoad' };
  }
  if (boundary.park) {
    return { multiplier: BOUNDARY_PARK_MULTIPLIER, kind: 'park' };
  }
  return { multiplier: 1, kind: 'none' };
}

function calculateResidential(input: ValuationInput): CalculationSection {
  const { village, segment, boundary } = input;
  const { multiplier, kind } = resolveBoundaryBonus(boundary);

  if (input.residentialMode === 'plot') {
    const useSegment = segment !== null;
    const rate = useSegment ? segment!.rate_nonagri : village[input.roadWidth];
    const subtotal = rate * input.area * multiplier;
    return {
      kind: 'residentialPlot',
      village,
      rate,
      rateSource: useSegment ? 'segment' : 'village',
      area: input.area,
      boundaryBonus: kind,
      subtotal,
    };
  }

  if (input.residentialMode === 'flat') {
    const rate = village[input.roadWidth];
    const superAreaWasEstimated = input.flatSuperArea === null || input.flatSuperArea <= 0;
    const superArea = superAreaWasEstimated
      ? input.flatCarpetArea / FLAT_MIN_CARPET_TO_SUPER_RATIO
      : input.flatSuperArea!;
    const subtotal = rate * superArea;
    return {
      kind: 'flat',
      village,
      rate,
      carpetArea: input.flatCarpetArea,
      superArea,
      superAreaWasEstimated,
      subtotal,
    };
  }

  // residentialMode === 'floor'
  const rate = village[input.roadWidth];
  const fullValue = rate * input.area;
  const denominator = input.floorWhich + 1;
  const subtotal = fullValue * floorShareFraction(input.floorWhich);
  return {
    kind: 'floorShare',
    village,
    rate,
    area: input.area,
    fullValue,
    which: input.floorWhich,
    denominator,
    subtotal,
  };
}

function calculateCommercial(input: ValuationInput): CalculationSection {
  const { village, segment, boundary, commercialType } = input;
  const { multiplier, kind } = resolveBoundaryBonus(boundary);
  const useSegment = segment !== null;

  const rate = useSegment
    ? commercialType === 'shop'
      ? segment!.rate_shop_land
      : segment!.rate_other_floor
    : commercialType === 'shop'
      ? village.comm_shop_land
      : village.comm_other_floor;

  const preDiscountValue = rate * input.commercialArea * multiplier;
  const floorDiscountPct = commercialType === 'other' ? input.commercialFloorDiscountPct : 0;
  const subtotal = preDiscountValue * (1 - floorDiscountPct / 100);

  return {
    kind: 'commercial',
    village,
    commercialType,
    rate,
    rateSource: useSegment ? 'segment' : 'village',
    area: input.commercialArea,
    boundaryBonus: kind,
    floorDiscountPct,
    preDiscountValue,
    subtotal,
  };
}

function calculateIndustrial(input: ValuationInput): CalculationSection {
  const { village, boundary } = input;
  const { multiplier, kind } = resolveBoundaryBonus(boundary);
  const baseRate = village[input.roadWidth];
  const industrialRate = baseRate * INDUSTRIAL_RATE_FACTOR;
  const subtotal = industrialRate * input.industrialArea * multiplier;
  return {
    kind: 'industrial',
    village,
    baseRate,
    industrialRate,
    area: input.industrialArea,
    boundaryBonus: kind,
    subtotal,
  };
}

function calculateAgricultural(input: ValuationInput): CalculationSection {
  const { village, agriType, agriUnit, agriArea, agriBonuses } = input;
  const areaHectares = toHectares(agriArea, agriUnit);
  const baseRateLakhPerHa = village[agriType];

  let multiplier = 1;
  const appliedBonuses: Array<'segmentRoad' | 'ringRoad' | 'aabadiProximity'> = [];
  if (agriBonuses.segmentRoad) {
    multiplier *= AGRI_SEGMENT_ROAD_MULTIPLIER;
    appliedBonuses.push('segmentRoad');
  }
  if (agriBonuses.ringRoad) {
    multiplier *= AGRI_RING_ROAD_MULTIPLIER;
    appliedBonuses.push('ringRoad');
  }
  // Rule 10's aabadi-proximity bonus only makes sense for land that is
  // already valued because it fronts a road, so (matching the original
  // app) it does not apply to the "general agricultural land" category.
  if (agriBonuses.aabadiProximity && agriType !== 'agri_general') {
    multiplier *= AGRI_AABADI_PROXIMITY_MULTIPLIER;
    appliedBonuses.push('aabadiProximity');
  }

  const effectiveRateLakhPerHa = baseRateLakhPerHa * multiplier;
  const subtotal = effectiveRateLakhPerHa * 100000 * areaHectares;

  return {
    kind: 'agricultural',
    village,
    agriType,
    baseRateLakhPerHa,
    effectiveRateLakhPerHa,
    appliedBonuses,
    area: agriArea,
    areaUnit: agriUnit,
    areaHectares,
    subtotal,
  };
}

function calculateConstruction(input: ValuationInput): CalculationSection | null {
  const { construction } = input;
  if (!construction.included || construction.coveredArea <= 0) return null;
  const rate = getConstructionRate(
    construction.buildType,
    construction.buildClass,
    construction.buildFloorTier,
  );
  return {
    kind: 'construction',
    buildType: construction.buildType,
    buildClass: construction.buildClass,
    buildFloorTier: construction.buildFloorTier,
    rate,
    area: construction.coveredArea,
    subtotal: rate * construction.coveredArea,
  };
}

function calculateTrees(input: ValuationInput): CalculationSection | null {
  if (input.trees.length === 0) return null;
  const lines = input.trees.map((tree) => {
    const rate = getTreeRate(tree.type, tree.age);
    return { type: tree.type, age: tree.age, qty: tree.qty, rate, value: rate * tree.qty };
  });
  const subtotal = lines.reduce((sum, line) => sum + line.value, 0);
  return { kind: 'trees', lines, subtotal };
}

function calculateAssets(input: ValuationInput): CalculationSection | null {
  const { borewellCount, kuanCount } = input.assets;
  if (borewellCount === 0 && kuanCount === 0) return null;
  const subtotal = borewellCount * BOREWELL_RATE + kuanCount * KUAN_RATE;
  return { kind: 'assets', borewellCount, kuanCount, subtotal };
}

/**
 * Compute the full property valuation for the given input.
 *
 * This is a pure function: given the same input it always returns the same
 * result, and it never touches the DOM or any UI state. This is what makes
 * it independently unit-testable (see valuationService.test.ts) and safe to
 * reuse from any future entry point (e.g. a bulk-calculation script).
 */
export function calculateValuation(input: ValuationInput): ValuationResult {
  const sections: CalculationSection[] = [];

  let primary: CalculationSection;
  switch (input.propertyType) {
    case 'res':
      primary = calculateResidential(input);
      break;
    case 'comm':
      primary = calculateCommercial(input);
      break;
    case 'indust':
      primary = calculateIndustrial(input);
      break;
    case 'agri':
      primary = calculateAgricultural(input);
      break;
  }
  sections.push(primary);

  // Construction add-on applies to everything except agricultural land,
  // matching the original app's `if (propType !== 'agri')` guard.
  if (input.propertyType !== 'agri') {
    const construction = calculateConstruction(input);
    if (construction) sections.push(construction);
  }

  const trees = calculateTrees(input);
  if (trees) sections.push(trees);

  const assets = calculateAssets(input);
  if (assets) sections.push(assets);

  const total = sections.reduce((sum, section) => sum + section.subtotal, 0);

  return { sections, total };
}
