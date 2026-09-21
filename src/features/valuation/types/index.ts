/**
 * Core domain types for the Pindra/Varanasi property valuation calculator.
 *
 * These mirror the data structures that were embedded directly in the
 * original index.html (see APP_DATA.villages / APP_DATA.segments) and the
 * business concepts implemented in its `calculate()` function. Nothing here
 * introduces new business meaning -- it names the same fields the original
 * app used, so the migration can be checked field-by-field against source.
 */

/** A village/mohalla row from the 2026 Part-2 rate list. */
export interface Village {
  /** Serial number, 1-442, as printed in the source rate list. */
  sl: number;
  /** Village/mohalla name in Devanagari (Hindi). */
  name: string;
  /** Halka/Pargana name in Devanagari. */
  pargana: string;
  /** Area classification as printed in the rate list. */
  category: VillageCategory;
  /** Non-agri base rate for 0-3m wide roads, INR per sq. meter. */
  rate_basic_0_3m: number;
  /** Residential rate for roads > 3m and <= 9m wide, INR per sq. meter. */
  res_3_9m: number;
  /** Residential rate for roads > 9m and <= 18m wide, INR per sq. meter. */
  res_9_18m: number;
  /** Residential rate for roads > 18m wide, INR per sq. meter. */
  res_gt18m: number;
  /** Commercial land rate for a single shop, INR per sq. meter. */
  comm_shop_land: number;
  /** Commercial floor rate for anything other than a single shop, INR per sq. meter. */
  comm_other_floor: number;
  /** Agricultural rate on a National/State Highway, INR lakh per hectare. */
  agri_nh_sh: number;
  /** Agricultural rate on a District Road/Expressway, INR lakh per hectare. */
  agri_dist_expwy: number;
  /** Agricultural rate on a Link Road, INR lakh per hectare. */
  agri_link_road: number;
  /** General agricultural rate (no road premium), INR lakh per hectare. */
  agri_general: number;
  /** English/Hinglish name -- from the official LGD village list where matched,
   *  otherwise a transliteration (see README for the ~70% match rate note). */
  en: string;
  /** Official Local Government Directory village code, where matched. Null if unmatched. */
  lgd_code: number | null;
}

export type VillageCategory = 'अर्द्धनगरीय' | 'ग्रामीण';

/**
 * A road-segment override row (Part-2, Form-3). Where a village fronts one
 * of these named roads, its rates replace the village's general rates for
 * that stretch of frontage.
 */
export interface SegmentRate {
  /** Segment number, 1-34, as printed in the source list. */
  seg_no: number;
  /** Description of the road stretch, in Devanagari. */
  seg_desc: string;
  /** Name of the affected village, in Devanagari -- matches Village.name
   *  in the common case, but ~11% of rows use a slightly different spelling
   *  within the source spreadsheet itself (see README). */
  village: string;
  /** Non-agri override rate, INR per sq. meter. */
  rate_nonagri: number;
  /** Single-shop land override rate, INR per sq. meter. */
  rate_shop_land: number;
  /** Other-commercial floor override rate, INR per sq. meter. */
  rate_other_floor: number;
  /** English/Hinglish name for the village field. */
  village_en: string;
}

/** Road-width keys used to index into a Village's residential rate fields. */
export type RoadWidthKey = 'rate_basic_0_3m' | 'res_3_9m' | 'res_9_18m' | 'res_gt18m';

/** Agricultural rate-category keys used to index into a Village's agri rate fields. */
export type AgriTypeKey = 'agri_nh_sh' | 'agri_dist_expwy' | 'agri_link_road' | 'agri_general';

export type PropertyType = 'res' | 'comm' | 'indust' | 'agri';

export type ResidentialMode = 'plot' | 'flat' | 'floor';

export type CommercialType = 'shop' | 'other';

export type AgriUnit = 'ha' | 'sqm' | 'acre' | 'bigha';

export type BuildType = 'rcc' | 'rbc' | 'kadi' | 'tin' | 'kuchcha' | 'commercial' | 'pmcm';

export type BuildClass = 0 | 1;

export type BuildFloorTier = 3 | 4 | 5;

export type TreeType = 'faldar' | 'imarati' | 'anya' | 'bans';

export type TreeAge = '5' | '10' | 'above';

export interface TreeEntry {
  id: number;
  type: TreeType;
  age: TreeAge;
  qty: number;
}

/** Boundary-condition bonuses (2019 general instructions, Rule 5). */
export interface BoundaryConditions {
  multiRoad: boolean;
  park: boolean;
}

/** Agricultural bonus toggles (2019 general instructions, Rules 9, 10, 22). */
export interface AgriBonuses {
  segmentRoad: boolean;
  ringRoad: boolean;
  aabadiProximity: boolean;
}

export interface ConstructionInput {
  included: boolean;
  buildType: BuildType;
  buildClass: BuildClass;
  buildFloorTier: BuildFloorTier;
  coveredArea: number;
}

/** Draft shape used while the user is editing the construction form --
 *  `coveredArea` is nullable until they've typed something, unlike the
 *  strict `ConstructionInput` the calculation engine expects. */
export interface ConstructionDraft {
  included: boolean;
  buildType: BuildType;
  buildClass: BuildClass;
  buildFloorTier: BuildFloorTier;
  coveredArea: number | null;
}

export interface AssetsInput {
  borewellCount: number;
  kuanCount: number;
}

/** Every field the calculation engine needs, gathered from the multi-step form. */
export interface ValuationInput {
  village: Village;
  segment: SegmentRate | null;
  propertyType: PropertyType;
  boundary: BoundaryConditions;

  // residential
  residentialMode: ResidentialMode;
  roadWidth: RoadWidthKey;
  area: number; // plot area (resMode='plot') or underlying land area (resMode='floor')
  flatCarpetArea: number;
  flatSuperArea: number | null; // null = auto-estimate from carpet/0.8
  floorTotalFloors: 2 | 3;
  floorWhich: 1 | 2 | 3 | 4 | 5 | 6;

  // commercial
  commercialType: CommercialType;
  commercialArea: number;
  commercialFloorDiscountPct: 0 | 10 | 15 | 20 | 35;

  // industrial
  industrialArea: number;

  // agricultural
  agriType: AgriTypeKey;
  agriUnit: AgriUnit;
  agriArea: number;
  agriBonuses: AgriBonuses;

  // add-ons
  construction: ConstructionInput;
  trees: TreeEntry[];
  assets: AssetsInput;
}

export type RateSource = 'village' | 'segment';

export type BoundaryBonusKind = 'none' | 'multiRoad' | 'park' | 'both';

/**
 * Structured, presentation-free calculation sections.
 *
 * Deliberately carries only raw data (numbers, enum-like string literals,
 * references) and no display strings -- translation happens in the UI layer
 * via `buildBreakdown()` (see features/valuation/utils/breakdownPresenter.ts)
 * so the calculation engine stays language-independent and trivially
 * unit-testable without an i18n context.
 */
export type CalculationSection =
  | {
      kind: 'residentialPlot';
      village: Village;
      rate: number;
      rateSource: RateSource;
      area: number;
      boundaryBonus: BoundaryBonusKind;
      subtotal: number;
    }
  | {
      kind: 'flat';
      village: Village;
      rate: number;
      carpetArea: number;
      superArea: number;
      superAreaWasEstimated: boolean;
      subtotal: number;
    }
  | {
      kind: 'floorShare';
      village: Village;
      rate: number;
      area: number;
      fullValue: number;
      which: 1 | 2 | 3 | 4 | 5 | 6;
      denominator: number;
      subtotal: number;
    }
  | {
      kind: 'commercial';
      village: Village;
      commercialType: CommercialType;
      rate: number;
      rateSource: RateSource;
      area: number;
      boundaryBonus: BoundaryBonusKind;
      floorDiscountPct: number;
      preDiscountValue: number;
      subtotal: number;
    }
  | {
      kind: 'industrial';
      village: Village;
      baseRate: number;
      industrialRate: number;
      area: number;
      boundaryBonus: BoundaryBonusKind;
      subtotal: number;
    }
  | {
      kind: 'agricultural';
      village: Village;
      agriType: AgriTypeKey;
      baseRateLakhPerHa: number;
      effectiveRateLakhPerHa: number;
      appliedBonuses: Array<'segmentRoad' | 'ringRoad' | 'aabadiProximity'>;
      area: number;
      areaUnit: AgriUnit;
      areaHectares: number;
      subtotal: number;
    }
  | {
      kind: 'construction';
      buildType: BuildType;
      buildClass: BuildClass;
      buildFloorTier: BuildFloorTier;
      rate: number;
      area: number;
      subtotal: number;
    }
  | {
      kind: 'trees';
      lines: Array<{ type: TreeType; age: TreeAge; qty: number; rate: number; value: number }>;
      subtotal: number;
    }
  | {
      kind: 'assets';
      borewellCount: number;
      kuanCount: number;
      subtotal: number;
    };

/** The full result of a calculation: structured sections plus the grand total. */
export interface ValuationResult {
  sections: CalculationSection[];
  total: number;
}

export type Language = 'hi' | 'en';
