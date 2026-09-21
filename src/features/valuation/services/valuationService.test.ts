import { describe, it, expect } from 'vitest';
import { calculateValuation, resolveBoundaryBonus } from './valuationService';
import { villages } from '../../../data/villages';
import type { ValuationInput } from '../types';

/**
 * REGRESSION SUITE
 *
 * These specific inputs/totals were hand-derived and verified against the
 * original vanilla-JS application during its own jsdom-based testing before
 * this React migration began (see project history). They are reproduced
 * here as the migration's baseline: if any of these break, the calculation
 * engine has diverged from the original app's verified behaviour.
 */

const aharak = villages.find((v) => v.name === 'अहरक')!;

function baseInput(overrides: Partial<ValuationInput> = {}): ValuationInput {
  return {
    village: aharak,
    segment: null,
    propertyType: 'res',
    boundary: { multiRoad: false, park: false },
    residentialMode: 'plot',
    roadWidth: 'rate_basic_0_3m',
    area: 0,
    flatCarpetArea: 0,
    flatSuperArea: null,
    floorTotalFloors: 2,
    floorWhich: 1,
    commercialType: 'shop',
    commercialArea: 0,
    commercialFloorDiscountPct: 0,
    industrialArea: 0,
    agriType: 'agri_general',
    agriUnit: 'ha',
    agriArea: 0,
    agriBonuses: { segmentRoad: false, ringRoad: false, aabadiProximity: false },
    construction: {
      included: false,
      buildType: 'rcc',
      buildClass: 0,
      buildFloorTier: 3,
      coveredArea: 0,
    },
    trees: [],
    assets: { borewellCount: 0, kuanCount: 0 },
    ...overrides,
  };
}

describe('calculateValuation - regression baseline', () => {
  it('REGRESSION A: plot + multi-road boundary bonus = ₹21,45,000', () => {
    const input = baseInput({
      roadWidth: 'res_9_18m',
      area: 150,
      boundary: { multiRoad: true, park: false },
    });
    const result = calculateValuation(input);
    // Aharak res_9_18m rate is 13000: 13000 * 150 * 1.10 = 2,145,000
    expect(result.total).toBe(2145000);
    expect(result.sections[0].kind).toBe('residentialPlot');
  });

  it('REGRESSION B: agricultural with stacked segment + ring-road bonuses = ₹1,56,25,000', () => {
    const input = baseInput({
      propertyType: 'agri',
      agriType: 'agri_general',
      agriUnit: 'ha',
      agriArea: 0.5,
      agriBonuses: { segmentRoad: true, ringRoad: true, aabadiProximity: false },
    });
    const result = calculateValuation(input);
    // 200 lakh/ha * 1.25 * 1.25 * 100000 * 0.5 = 15,625,000
    expect(result.total).toBe(15625000);
  });

  it('REGRESSION C: combined plot + construction + trees + assets = ₹27,95,000', () => {
    const input = baseInput({
      roadWidth: 'rate_basic_0_3m',
      area: 100,
      construction: {
        included: true,
        buildType: 'rcc',
        buildClass: 0,
        buildFloorTier: 3,
        coveredArea: 80,
      },
      trees: [{ id: 1, type: 'faldar', age: '10', qty: 3 }],
      assets: { borewellCount: 1, kuanCount: 2 },
    });
    const result = calculateValuation(input);
    // land: 9000*100 = 900,000
    // construction: 21000*80 = 1,680,000
    // trees: 5000*3 = 15,000
    // assets: 100000 + 2*50000 = 200,000
    // total = 2,795,000
    expect(result.total).toBe(2795000);
    expect(result.sections.map((s) => s.kind)).toEqual([
      'residentialPlot',
      'construction',
      'trees',
      'assets',
    ]);
  });
});

describe('resolveBoundaryBonus', () => {
  it('returns no bonus when neither condition applies', () => {
    expect(resolveBoundaryBonus({ multiRoad: false, park: false })).toEqual({
      multiplier: 1,
      kind: 'none',
    });
  });
  it('returns +10% for multi-road alone', () => {
    expect(resolveBoundaryBonus({ multiRoad: true, park: false }).multiplier).toBe(1.1);
  });
  it('returns +10% for park alone', () => {
    expect(resolveBoundaryBonus({ multiRoad: false, park: true }).multiplier).toBe(1.1);
  });
  it('returns a flat +15% (not +20%) when both apply', () => {
    const { multiplier, kind } = resolveBoundaryBonus({ multiRoad: true, park: true });
    expect(multiplier).toBe(1.15);
    expect(kind).toBe('both');
  });
});

describe('calculateValuation - per property type', () => {
  it('computes a flat/apartment valuation with auto-estimated super area', () => {
    const input = baseInput({
      residentialMode: 'flat',
      roadWidth: 'rate_basic_0_3m',
      flatCarpetArea: 80,
      flatSuperArea: null,
    });
    const result = calculateValuation(input);
    // super area = 80 / 0.8 = 100; rate 9000 * 100 = 900,000
    expect(result.total).toBe(900000);
    if (result.sections[0].kind === 'flat') {
      expect(result.sections[0].superAreaWasEstimated).toBe(true);
      expect(result.sections[0].superArea).toBe(100);
    } else {
      throw new Error('expected flat section');
    }
  });

  it('computes a partial floor/roof transfer using the correct fraction', () => {
    const input = baseInput({
      residentialMode: 'floor',
      roadWidth: 'rate_basic_0_3m',
      area: 100,
      floorWhich: 2, // 1st floor roof -> 1/3
    });
    const result = calculateValuation(input);
    // full value = 9000*100 = 900,000; * 1/3 = 300,000
    expect(result.total).toBe(300000);
  });

  it('computes industrial land at 60% of the residential rate', () => {
    const input = baseInput({
      propertyType: 'indust',
      roadWidth: 'rate_basic_0_3m',
      industrialArea: 1000,
    });
    const result = calculateValuation(input);
    // 9000 * 0.6 * 1000 = 5,400,000
    expect(result.total).toBe(5400000);
  });

  it('applies a segment override rate when a segment is selected', () => {
    const input = baseInput({
      segment: {
        seg_no: 1,
        seg_desc: 'test segment',
        village: 'अहरक',
        rate_nonagri: 42000,
        rate_shop_land: 50000,
        rate_other_floor: 55000,
        village_en: 'Aharak',
      },
      roadWidth: 'rate_basic_0_3m',
      area: 10,
    });
    const result = calculateValuation(input);
    expect(result.total).toBe(420000); // 42000 * 10, segment rate used instead of village rate
    if (result.sections[0].kind === 'residentialPlot') {
      expect(result.sections[0].rateSource).toBe('segment');
    }
  });

  it('does not apply the aabadi-proximity bonus to general agricultural land', () => {
    const input = baseInput({
      propertyType: 'agri',
      agriType: 'agri_general',
      agriArea: 1,
      agriBonuses: { segmentRoad: false, ringRoad: false, aabadiProximity: true },
    });
    const result = calculateValuation(input);
    // 200 lakh/ha * 100000 * 1 ha, no bonus applied
    expect(result.total).toBe(20000000);
    if (result.sections[0].kind === 'agricultural') {
      expect(result.sections[0].appliedBonuses).toEqual([]);
    }
  });

  it('does not apply the construction add-on to agricultural land', () => {
    const input = baseInput({
      propertyType: 'agri',
      agriType: 'agri_general',
      agriArea: 0.1,
      construction: {
        included: true,
        buildType: 'rcc',
        buildClass: 0,
        buildFloorTier: 3,
        coveredArea: 50,
      },
    });
    const result = calculateValuation(input);
    expect(result.sections.some((s) => s.kind === 'construction')).toBe(false);
  });
});
