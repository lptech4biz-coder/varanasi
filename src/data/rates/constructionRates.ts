import type { BuildType, BuildClass, BuildFloorTier } from '../../features/valuation/types';

/**
 * Generic construction valuation rates.
 *
 * Source: 2019 general instructions document (RateList_353_01-08-2019.pdf),
 * Part-3 Form-5, plus Rules 6 (commercial fixed rate) and 29 (PM/CM Awas
 * Yojana rate). These are NOT present in the 2026 rate list -- the original
 * app carried them forward from 2019 and tagged every UI element that uses
 * them with a "2019 Rule" badge. This module preserves that same rule
 * verbatim; do not silently update these figures without re-confirming
 * with the source office.
 */
export const RCC_RATES: Record<BuildFloorTier, [classOne: number, classTwo: number]> = {
  3: [21000, 20000],
  4: [23000, 22000],
  5: [25000, 24000],
};

export const RBC_RATES: Record<BuildFloorTier, [classOne: number, classTwo: number]> = {
  3: [20000, 19000],
  4: [22000, 21000],
  5: [24000, 23000],
};

export const KADI_GIRDER_RATES: [classOne: number, classTwo: number] = [17000, 16000];

export const TIN_SHED_RATE = 4000;
export const KUCHCHA_RATE = 3000;
export const COMMERCIAL_FIXED_CONSTRUCTION_RATE = 21000;
export const PM_CM_AWAS_YOJANA_RATE = 14000;

/**
 * Resolve the construction rate (INR per sq. meter) for a given build type,
 * class, and floor tier. `buildClass` and `buildFloorTier` are ignored for
 * build types that don't vary by class/tier (tin, kuchcha, commercial, pmcm).
 */
export function getConstructionRate(
  buildType: BuildType,
  buildClass: BuildClass,
  buildFloorTier: BuildFloorTier,
): number {
  switch (buildType) {
    case 'rcc':
      return RCC_RATES[buildFloorTier][buildClass];
    case 'rbc':
      return RBC_RATES[buildFloorTier][buildClass];
    case 'kadi':
      return KADI_GIRDER_RATES[buildClass];
    case 'tin':
      return TIN_SHED_RATE;
    case 'kuchcha':
      return KUCHCHA_RATE;
    case 'commercial':
      return COMMERCIAL_FIXED_CONSTRUCTION_RATE;
    case 'pmcm':
      return PM_CM_AWAS_YOJANA_RATE;
  }
}
