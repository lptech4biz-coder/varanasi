import type { Village, SegmentRate } from '../../features/valuation/types';
import villagesJson from './villages.json';
import segmentsJson from './segments.json';

/**
 * All 442 villages/mohallas from the Pindra tehsil 2026 Part-2 rate list.
 *
 * Source: office-provided `Pindra_Rate_list_26-07-26_Complite.xls`, sheet
 * "Pindra New Ratlist 2026". Original text was in a legacy Krutidev-style
 * encoding and was converted to Unicode during the original migration --
 * see the project README for the conversion notes and known caveats
 * (2 villages' pargana spelling normalised; 2 villages had stray trailing
 * commas in the source removed).
 */
export const villages: Village[] = villagesJson as Village[];

/**
 * All 255 segment-road override rows across 34 named road stretches
 * (Part-2, Form-3 equivalent in the 2026 sheet, "VNS&Janpadiya&Market").
 */
export const segments: SegmentRate[] = segmentsJson as SegmentRate[];

// Data-integrity guards: fail fast in dev if the bundled JSON is ever
// edited in a way that silently drops records.
const EXPECTED_VILLAGE_COUNT = 442;
const EXPECTED_SEGMENT_COUNT = 255;

if (import.meta.env.DEV) {
  if (villages.length !== EXPECTED_VILLAGE_COUNT) {
    // eslint-disable-next-line no-console
    console.warn(
      `[data] Expected ${EXPECTED_VILLAGE_COUNT} villages, found ${villages.length}. ` +
        'Verify villages.json was not accidentally truncated.',
    );
  }
  if (segments.length !== EXPECTED_SEGMENT_COUNT) {
    // eslint-disable-next-line no-console
    console.warn(
      `[data] Expected ${EXPECTED_SEGMENT_COUNT} segments, found ${segments.length}. ` +
        'Verify segments.json was not accidentally truncated.',
    );
  }
}

/** Find a village by its exact Devanagari name. */
export function findVillageByName(name: string): Village | undefined {
  return villages.find((v) => v.name === name);
}

/** All segment rows that apply to a given village (by exact name match). */
export function findSegmentsForVillage(villageName: string): SegmentRate[] {
  return segments.filter((s) => s.village === villageName);
}
