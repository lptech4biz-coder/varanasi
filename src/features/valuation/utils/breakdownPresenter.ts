import { formatINR, formatNumber } from '../../../utils/format';
import type { TranslationKey } from '../../../i18n';
import type { CalculationSection, BoundaryBonusKind, Village } from '../types';

export interface DisplayRow {
  label: string;
  value: string;
}

export interface DisplaySection {
  title: string;
  rows: DisplayRow[];
  subtotal: number;
}

type T = (key: TranslationKey, params?: Record<string, string | number>) => string;

const FLOOR_LABELS: Record<1 | 2 | 3 | 4 | 5 | 6, TranslationKey> = {
  1: 'residential.ground',
  2: 'residential.first',
  3: 'residential.second',
  4: 'residential.third',
  5: 'residential.fourth',
  6: 'residential.fifth',
};

function boundaryLabel(t: T, kind: BoundaryBonusKind): string | null {
  if (kind === 'multiRoad') return t('boundary.multiRoadBonus');
  if (kind === 'park') return t('boundary.parkBonus');
  if (kind === 'both') return t('boundary.bothBonus');
  return null;
}

/**
 * Convert one structured, presentation-free `CalculationSection` into a
 * displayable section (translated title + rows). This is the only place
 * in the codebase that turns calculation data into language-specific text,
 * keeping `valuationService.ts` itself fully language-independent.
 */
export function presentSection(section: CalculationSection, t: T): DisplaySection {
  const sqm = t('village.sqm');
  const villageLabel = (village: Village) => `${village.name} (${village.en})`;

  switch (section.kind) {
    case 'residentialPlot': {
      const rows: DisplayRow[] = [
        { label: t('village.village'), value: villageLabel(section.village) },
        {
          label: t('common.rate'),
          value: `${formatINR(section.rate)}/${sqm}${section.rateSource === 'segment' ? ` [${t('segment.segmentRate')}]` : ''}`,
        },
        { label: t('common.area'), value: formatNumber(section.area) + ' ' + sqm },
      ];
      const bonus = boundaryLabel(t, section.boundaryBonus);
      if (bonus) rows.push({ label: t('boundary.increase'), value: bonus });
      return { title: t('residential.plotSectionTitle'), rows, subtotal: section.subtotal };
    }

    case 'flat': {
      const rows: DisplayRow[] = [
        { label: t('village.village'), value: villageLabel(section.village) },
        { label: t('common.rate'), value: `${formatINR(section.rate)}/${sqm}` },
        { label: t('residential.carpetArea'), value: formatNumber(section.carpetArea) + ' ' + sqm },
        {
          label: t('residential.superArea'),
          value:
            formatNumber(section.superArea) +
            ' ' +
            sqm +
            (section.superAreaWasEstimated ? ` (${t('residential.superAreaAutoEstimated')})` : ''),
        },
      ];
      return { title: t('residential.flatSectionTitle'), rows, subtotal: section.subtotal };
    }

    case 'floorShare': {
      const rows: DisplayRow[] = [
        { label: t('village.village'), value: villageLabel(section.village) },
        { label: t('common.rate'), value: `${formatINR(section.rate)}/${sqm}` },
        { label: t('common.area'), value: formatNumber(section.area) + ' ' + sqm },
        { label: t('residential.fullLandValue'), value: formatINR(section.fullValue) },
        {
          label: `${t(FLOOR_LABELS[section.which])} ${t('residential.roofShare')}`,
          value: `1/${section.denominator}`,
        },
      ];
      return { title: t('residential.floorSectionTitle'), rows, subtotal: section.subtotal };
    }

    case 'commercial': {
      const rows: DisplayRow[] = [
        { label: t('village.village'), value: villageLabel(section.village) },
        {
          label: t('common.type'),
          value: section.commercialType === 'shop' ? t('commercial.shopType') : t('commercial.otherType'),
        },
        {
          label: t('common.rate'),
          value: `${formatINR(section.rate)}/${sqm}${section.rateSource === 'segment' ? ` [${t('segment.segmentRate')}]` : ''}`,
        },
        { label: t('common.area'), value: formatNumber(section.area) + ' ' + sqm },
      ];
      const bonus = boundaryLabel(t, section.boundaryBonus);
      if (bonus) rows.push({ label: t('boundary.increase'), value: bonus });
      if (section.floorDiscountPct > 0) {
        rows.push({ label: t('commercial.floorDiscount'), value: `-${section.floorDiscountPct}%` });
      }
      return { title: t('commercial.sectionTitle'), rows, subtotal: section.subtotal };
    }

    case 'industrial': {
      const rows: DisplayRow[] = [
        { label: t('village.village'), value: villageLabel(section.village) },
        { label: t('industrial.baseRate'), value: `${formatINR(section.baseRate)}/${sqm}` },
        { label: t('industrial.industrialRate'), value: `${formatINR(section.industrialRate)}/${sqm}` },
        { label: t('common.area'), value: formatNumber(section.area) + ' ' + sqm },
      ];
      const bonus = boundaryLabel(t, section.boundaryBonus);
      if (bonus) rows.push({ label: t('boundary.increase'), value: bonus });
      return { title: t('industrial.sectionTitle'), rows, subtotal: section.subtotal };
    }

    case 'agricultural': {
      const typeLabels: Record<string, TranslationKey> = {
        agri_nh_sh: 'agricultural.nhSh',
        agri_dist_expwy: 'agricultural.distExpwy',
        agri_link_road: 'agricultural.linkRoad',
        agri_general: 'agricultural.general',
      };
      const unitLabels: Record<string, TranslationKey> = {
        ha: 'agricultural.hectare',
        sqm: 'agricultural.sqm',
        acre: 'agricultural.acre',
        bigha: 'agricultural.bigha',
      };
      const bonusLabels: Record<string, TranslationKey> = {
        segmentRoad: 'agricultural.segmentRoadBonus',
        ringRoad: 'agricultural.ringRoadBonus',
        aabadiProximity: 'agricultural.aabadiProximityBonus',
      };
      const lakhHa = t('agricultural.lakhPerHa');
      const rows: DisplayRow[] = [
        { label: t('village.village'), value: villageLabel(section.village) },
        { label: t('village.category'), value: t(typeLabels[section.agriType]) },
        { label: t('agricultural.baseRate'), value: `${formatNumber(section.baseRateLakhPerHa)} ${lakhHa}` },
      ];
      if (section.appliedBonuses.length > 0) {
        rows.push({
          label: t('agricultural.additionalIncrease'),
          value: section.appliedBonuses.map((b) => t(bonusLabels[b])).join(', '),
        });
      }
      rows.push({
        label: t('agricultural.effectiveRate'),
        value: `${formatNumber(section.effectiveRateLakhPerHa)} ${lakhHa}`,
      });
      rows.push({
        label: t('common.area'),
        value:
          formatNumber(section.area) +
          ' ' +
          t(unitLabels[section.areaUnit]) +
          (section.areaUnit !== 'ha'
            ? ` (= ${formatNumber(section.areaHectares, 4)} ${t('agricultural.hectareUnit')})`
            : ''),
      });
      return { title: t('agricultural.sectionTitle'), rows, subtotal: section.subtotal };
    }

    case 'construction': {
      const typeLabels: Record<string, TranslationKey> = {
        rcc: 'construction.rcc',
        rbc: 'construction.rbc',
        kadi: 'construction.kadi',
        tin: 'construction.tin',
        kuchcha: 'construction.kuchcha',
        commercial: 'construction.commercial',
        pmcm: 'construction.pmcm',
      };
      const classLabel = section.buildClass === 0 ? t('construction.class1') : t('construction.class2');
      const hasTier = section.buildType === 'rcc' || section.buildType === 'rbc';
      const typeDisplay = hasTier
        ? `${t(typeLabels[section.buildType])} (${classLabel}, ${section.buildFloorTier} ${t('construction.floorTier').toLowerCase()})`
        : section.buildType === 'kadi'
          ? `${t(typeLabels[section.buildType])} (${classLabel})`
          : t(typeLabels[section.buildType]);
      const rows: DisplayRow[] = [
        { label: t('common.type'), value: typeDisplay },
        { label: t('common.rate'), value: `${formatINR(section.rate)}/${sqm}` },
        { label: t('construction.coveredArea'), value: formatNumber(section.area) + ' ' + sqm },
      ];
      return { title: t('construction.sectionTitle'), rows, subtotal: section.subtotal };
    }

    case 'trees': {
      const typeLabels: Record<string, TranslationKey> = {
        faldar: 'trees.faldarTree',
        imarati: 'trees.imaratiTree',
        anya: 'trees.anyaTree',
        bans: 'trees.bans',
      };
      const rows: DisplayRow[] = section.lines.map((line) => ({
        label: '',
        value: `${t(typeLabels[line.type])} × ${line.qty} (${formatINR(line.rate)}/${t('trees.unit')}) = ${formatINR(line.value)}`,
      }));
      return { title: t('trees.sectionTitle'), rows, subtotal: section.subtotal };
    }

    case 'assets': {
      const rows: DisplayRow[] = [];
      if (section.borewellCount > 0) {
        rows.push({
          label: '',
          value: `${t('assets.borewell')} × ${section.borewellCount} (${t('assets.borewellRate')}) = ${formatINR(section.borewellCount * 100000)}`,
        });
      }
      if (section.kuanCount > 0) {
        rows.push({
          label: '',
          value: `${t('assets.kuan')} × ${section.kuanCount} (${t('assets.kuanRate')}) = ${formatINR(section.kuanCount * 50000)}`,
        });
      }
      return { title: t('assets.sectionTitle'), rows, subtotal: section.subtotal };
    }
  }
}

export function presentValuation(
  sections: CalculationSection[],
  t: T,
): { sections: DisplaySection[]; total: number } {
  const displaySections = sections.map((s) => presentSection(s, t));
  const total = sections.reduce((sum, s) => sum + s.subtotal, 0);
  return { sections: displaySections, total };
}
