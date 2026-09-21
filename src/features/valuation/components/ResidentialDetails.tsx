import { useLanguage } from '../../../i18n';
import { formatINR } from '../../../utils/format';
import { Card } from '../../../components/common/Card';
import { ToggleGroup } from '../../../components/common/ToggleGroup';
import { FormField } from '../../../components/common/FormField';
import { TextInput } from '../../../components/common/TextInput';
import { Select } from '../../../components/common/Select';
import { Note } from '../../../components/common/Note';
import type { ResidentialMode, RoadWidthKey, SegmentRate } from '../types';

interface ResidentialDetailsProps {
  segment: SegmentRate | null;
  mode: ResidentialMode;
  onModeChange: (mode: ResidentialMode) => void;
  roadWidth: RoadWidthKey;
  onRoadWidthChange: (value: RoadWidthKey) => void;
  area: number | null;
  onAreaChange: (value: number | null) => void;
  flatCarpetArea: number | null;
  onFlatCarpetAreaChange: (value: number | null) => void;
  flatSuperArea: number | null;
  onFlatSuperAreaChange: (value: number | null) => void;
  floorWhich: 1 | 2 | 3 | 4 | 5 | 6;
  onFloorWhichChange: (value: 1 | 2 | 3 | 4 | 5 | 6) => void;
  errors: Record<string, string>;
}

export function ResidentialDetails({
  segment,
  mode,
  onModeChange,
  roadWidth,
  onRoadWidthChange,
  area,
  onAreaChange,
  flatCarpetArea,
  onFlatCarpetAreaChange,
  flatSuperArea,
  onFlatSuperAreaChange,
  floorWhich,
  onFloorWhichChange,
  errors,
}: ResidentialDetailsProps) {
  const { t } = useLanguage();

  const roadWidthOptions = [
    { value: 'rate_basic_0_3m' as const, label: t('residential.roadWidth_0_3') },
    { value: 'res_3_9m' as const, label: t('residential.roadWidth_3_9') },
    { value: 'res_9_18m' as const, label: t('residential.roadWidth_9_18') },
    { value: 'res_gt18m' as const, label: t('residential.roadWidth_gt18') },
  ];

  return (
    <Card title={t('residential.step')}>
      <ToggleGroup
        aria-label={t('residential.step')}
        value={mode}
        onChange={onModeChange}
        options={[
          { value: 'plot', label: t('residential.modePlot') },
          { value: 'flat', label: t('residential.modeFlat') },
          { value: 'floor', label: t('residential.modeFloor') },
        ]}
      />

      {mode === 'plot' && (
        <div style={{ marginTop: 16 }}>
          {segment ? (
            <Note badge={t('segment.segmentRate')}>
              {t('segment.resNote', { rate: `${formatINR(segment.rate_nonagri)}/${t('village.sqm')}` })}
            </Note>
          ) : (
            <FormField htmlFor="roadWidth" label={t('residential.roadWidth')} required>
              <Select
                id="roadWidth"
                value={roadWidth}
                onChange={(e) => onRoadWidthChange(e.target.value as RoadWidthKey)}
              >
                {roadWidthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </FormField>
          )}
          <FormField htmlFor="resArea" label={t('residential.area')} required error={errors.resArea}>
            <TextInput
              id="resArea"
              type="number"
              step="0.01"
              min="0"
              placeholder={t('village.searchPlaceholder')}
              value={area ?? ''}
              invalid={!!errors.resArea}
              onChange={(e) => onAreaChange(e.target.value ? Number(e.target.value) : null)}
            />
          </FormField>
        </div>
      )}

      {mode === 'flat' && (
        <div style={{ marginTop: 16 }}>
          <FormField htmlFor="roadWidthFlat" label={t('residential.roadWidthCategory')} required>
            <Select
              id="roadWidthFlat"
              value={roadWidth}
              onChange={(e) => onRoadWidthChange(e.target.value as RoadWidthKey)}
            >
              {roadWidthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField
            htmlFor="flatCarpet"
            label={t('residential.carpetArea')}
            required
            error={errors.flatCarpet}
          >
            <TextInput
              id="flatCarpet"
              type="number"
              step="0.01"
              min="0"
              value={flatCarpetArea ?? ''}
              invalid={!!errors.flatCarpet}
              onChange={(e) => onFlatCarpetAreaChange(e.target.value ? Number(e.target.value) : null)}
            />
          </FormField>
          <FormField htmlFor="flatSuper" label={t('residential.superArea')} optionalTag="(optional)">
            <TextInput
              id="flatSuper"
              type="number"
              step="0.01"
              min="0"
              placeholder={t('residential.superAreaAutoPlaceholder')}
              value={flatSuperArea ?? ''}
              onChange={(e) => onFlatSuperAreaChange(e.target.value ? Number(e.target.value) : null)}
            />
          </FormField>
          <Note badge={t('boundary.ruleBadge')}>{t('residential.flatNote')}</Note>
        </div>
      )}

      {mode === 'floor' && (
        <div style={{ marginTop: 16 }}>
          <FormField htmlFor="floorWhich" label={t('residential.whichFloor')} required>
            <Select
              id="floorWhich"
              value={floorWhich}
              onChange={(e) => onFloorWhichChange(Number(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6)}
            >
              <option value={1}>{t('residential.ground')} — 1/2</option>
              <option value={2}>{t('residential.first')} — 1/3</option>
              <option value={3}>{t('residential.second')} — 1/4</option>
              <option value={4}>{t('residential.third')} — 1/5</option>
              <option value={5}>{t('residential.fourth')} — 1/6</option>
              <option value={6}>{t('residential.fifth')} — 1/7</option>
            </Select>
          </FormField>
          <FormField
            htmlFor="floorArea"
            label={t('residential.underlyingArea')}
            required
            error={errors.floorArea}
          >
            <TextInput
              id="floorArea"
              type="number"
              step="0.01"
              min="0"
              value={area ?? ''}
              invalid={!!errors.floorArea}
              onChange={(e) => onAreaChange(e.target.value ? Number(e.target.value) : null)}
            />
          </FormField>
          <FormField htmlFor="floorRoadWidth" label={t('residential.roadWidthForBase')} required>
            <Select
              id="floorRoadWidth"
              value={roadWidth}
              onChange={(e) => onRoadWidthChange(e.target.value as RoadWidthKey)}
            >
              {roadWidthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </FormField>
          <Note badge={t('boundary.ruleBadge')}>{t('residential.floorNote')}</Note>
        </div>
      )}
    </Card>
  );
}
