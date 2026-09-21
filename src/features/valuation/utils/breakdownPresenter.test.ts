import { describe, it, expect } from 'vitest';
import { hi } from '../../../i18n/hi';
import { en } from '../../../i18n/en';
import { presentValuation } from './breakdownPresenter';
import { calculateValuation } from '../services/valuationService';
import { villages } from '../../../data/villages';
import type { TranslationKey } from '../../../i18n';
import type { ValuationInput } from '../types';

const dictionaries = { hi, en };
function resolve(dict: object, path: string): string {
  return path
    .split('.')
    .reduce<unknown>((acc, part) => (acc as Record<string, unknown>)[part], dict) as string;
}
function makeT(lang: 'hi' | 'en') {
  return (key: TranslationKey) => resolve(dictionaries[lang], key);
}

const aharak = villages.find((v) => v.name === 'अहरक')!;

function baseInput(overrides: Partial<ValuationInput> = {}): ValuationInput {
  return {
    village: aharak,
    segment: null,
    propertyType: 'res',
    boundary: { multiRoad: false, park: false },
    residentialMode: 'plot',
    roadWidth: 'res_9_18m',
    area: 150,
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
    construction: { included: false, buildType: 'rcc', buildClass: 0, buildFloorTier: 3, coveredArea: 0 },
    trees: [],
    assets: { borewellCount: 0, kuanCount: 0 },
    ...overrides,
  };
}

describe('presentValuation', () => {
  it('produces the same total as the calculation engine, in both languages', () => {
    const input = baseInput({ boundary: { multiRoad: true, park: false } });
    const result = calculateValuation(input);

    const hiDisplay = presentValuation(result.sections, makeT('hi'));
    const enDisplay = presentValuation(result.sections, makeT('en'));

    expect(hiDisplay.total).toBe(result.total);
    expect(enDisplay.total).toBe(result.total);
    expect(hiDisplay.total).toBe(2145000);
  });

  it('never leaves an untranslated key (a literal containing a dot) in a label or value', () => {
    const input = baseInput({
      propertyType: 'agri',
      agriType: 'agri_nh_sh',
      agriArea: 1,
      agriBonuses: { segmentRoad: true, ringRoad: false, aabadiProximity: true },
    });
    const result = calculateValuation(input);
    const display = presentValuation(result.sections, makeT('en'));
    for (const section of display.sections) {
      expect(section.title).not.toMatch(/^[a-z]+\.[a-zA-Z]+$/);
      for (const row of section.rows) {
        expect(row.label).not.toMatch(/^[a-z]+\.[a-zA-Z]+$/);
      }
    }
  });

  it('renders distinct titles for each residential mode', () => {
    const plot = calculateValuation(baseInput({ residentialMode: 'plot' }));
    const flat = calculateValuation(baseInput({ residentialMode: 'flat', flatCarpetArea: 80 }));
    const floor = calculateValuation(baseInput({ residentialMode: 'floor', area: 100, floorWhich: 2 }));

    const t = makeT('en');
    expect(presentValuation(plot.sections, t).sections[0].title).toBe('Residential Land (Plot)');
    expect(presentValuation(flat.sections, t).sections[0].title).toBe('Flat/Apartment');
    expect(presentValuation(floor.sections, t).sections[0].title).toBe('Partial Floor/Roof Transfer');
  });
});
