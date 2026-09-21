import { useLanguage } from '../../../i18n';
import { Card } from '../../../components/common/Card';
import { FormField } from '../../../components/common/FormField';
import { TextInput } from '../../../components/common/TextInput';
import { Select } from '../../../components/common/Select';
import { Note } from '../../../components/common/Note';
import type { RoadWidthKey } from '../types';

interface IndustrialDetailsProps {
  roadWidth: RoadWidthKey;
  onRoadWidthChange: (value: RoadWidthKey) => void;
  area: number | null;
  onAreaChange: (value: number | null) => void;
  errors: Record<string, string>;
}

export function IndustrialDetails({
  roadWidth,
  onRoadWidthChange,
  area,
  onAreaChange,
  errors,
}: IndustrialDetailsProps) {
  const { t } = useLanguage();
  return (
    <Card title={t('industrial.step')}>
      <FormField htmlFor="industRoadWidth" label={t('industrial.roadWidth')} required>
        <Select
          id="industRoadWidth"
          value={roadWidth}
          onChange={(e) => onRoadWidthChange(e.target.value as RoadWidthKey)}
        >
          <option value="rate_basic_0_3m">{t('residential.roadWidth_0_3')}</option>
          <option value="res_3_9m">{t('residential.roadWidth_3_9')}</option>
          <option value="res_9_18m">{t('residential.roadWidth_9_18')}</option>
          <option value="res_gt18m">{t('residential.roadWidth_gt18')}</option>
        </Select>
      </FormField>
      <FormField htmlFor="industArea" label={t('industrial.area')} required error={errors.industArea}>
        <TextInput
          id="industArea"
          type="number"
          step="0.01"
          min="0"
          value={area ?? ''}
          invalid={!!errors.industArea}
          onChange={(e) => onAreaChange(e.target.value ? Number(e.target.value) : null)}
        />
      </FormField>
      <Note badge={t('boundary.ruleBadge')}>{t('industrial.note')}</Note>
    </Card>
  );
}
