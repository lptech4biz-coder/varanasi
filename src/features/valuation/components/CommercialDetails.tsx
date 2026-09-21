import { useLanguage } from '../../../i18n';
import { Card } from '../../../components/common/Card';
import { ToggleGroup } from '../../../components/common/ToggleGroup';
import { FormField } from '../../../components/common/FormField';
import { TextInput } from '../../../components/common/TextInput';
import { Select } from '../../../components/common/Select';
import { Note } from '../../../components/common/Note';
import { formatINR } from '../../../utils/format';
import type { CommercialType, SegmentRate } from '../types';

interface CommercialDetailsProps {
  segment: SegmentRate | null;
  commercialType: CommercialType;
  onCommercialTypeChange: (value: CommercialType) => void;
  area: number | null;
  onAreaChange: (value: number | null) => void;
  floorDiscountPct: 0 | 10 | 15 | 20 | 35;
  onFloorDiscountChange: (value: 0 | 10 | 15 | 20 | 35) => void;
  errors: Record<string, string>;
}

export function CommercialDetails({
  segment,
  commercialType,
  onCommercialTypeChange,
  area,
  onAreaChange,
  floorDiscountPct,
  onFloorDiscountChange,
  errors,
}: CommercialDetailsProps) {
  const { t } = useLanguage();

  return (
    <Card title={t('commercial.step')}>
      {segment && (
        <Note badge={t('segment.segmentRate')}>
          {t('segment.commNote', {
            shopRate: `${formatINR(segment.rate_shop_land)}/${t('village.sqm')}`,
            floorRate: `${formatINR(segment.rate_other_floor)}/${t('village.sqm')}`,
          })}
        </Note>
      )}
      <div style={{ marginTop: 14, marginBottom: 14 }}>
        <ToggleGroup
          aria-label={t('commercial.step')}
          value={commercialType}
          onChange={onCommercialTypeChange}
          options={[
            { value: 'shop', label: t('commercial.shop') },
            { value: 'other', label: t('commercial.other') },
          ]}
        />
      </div>
      <FormField
        htmlFor="commArea"
        label={commercialType === 'shop' ? t('commercial.area') : t('commercial.carpetArea')}
        required
        error={errors.commArea}
      >
        <TextInput
          id="commArea"
          type="number"
          step="0.01"
          min="0"
          value={area ?? ''}
          invalid={!!errors.commArea}
          onChange={(e) => onAreaChange(e.target.value ? Number(e.target.value) : null)}
        />
      </FormField>

      {commercialType === 'other' && (
        <div>
          <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--color-muted)', marginBottom: 10 }}>
            {t('commercial.floorDiscountTitle')}
          </div>
          <FormField htmlFor="floorSel" label={t('commercial.floor')} optionalTag="(optional)">
            <Select
              id="floorSel"
              value={floorDiscountPct}
              onChange={(e) => onFloorDiscountChange(Number(e.target.value) as 0 | 10 | 15 | 20 | 35)}
            >
              <option value={0}>{t('commercial.floorGround')}</option>
              <option value={10}>{t('commercial.floor1')}</option>
              <option value={15}>{t('commercial.floor2')}</option>
              <option value={20}>{t('commercial.floor3')}</option>
              <option value={35}>{t('commercial.floor4')}</option>
            </Select>
          </FormField>
          <Note badge={t('commercial.generalRuleBadge')}>{t('commercial.floorDiscountNote')}</Note>
        </div>
      )}
    </Card>
  );
}
