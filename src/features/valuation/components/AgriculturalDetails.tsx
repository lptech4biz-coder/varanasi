import { useLanguage } from '../../../i18n';
import { Card } from '../../../components/common/Card';
import { FormField } from '../../../components/common/FormField';
import { TextInput } from '../../../components/common/TextInput';
import { Select } from '../../../components/common/Select';
import { Checkline } from '../../../components/common/Checkline';
import { Note } from '../../../components/common/Note';
import type { AgriBonuses, AgriTypeKey, AgriUnit } from '../types';

interface AgriculturalDetailsProps {
  agriType: AgriTypeKey;
  onAgriTypeChange: (value: AgriTypeKey) => void;
  agriUnit: AgriUnit;
  onAgriUnitChange: (value: AgriUnit) => void;
  area: number | null;
  onAreaChange: (value: number | null) => void;
  bonuses: AgriBonuses;
  onBonusesChange: (patch: Partial<AgriBonuses>) => void;
  errors: Record<string, string>;
}

export function AgriculturalDetails({
  agriType,
  onAgriTypeChange,
  agriUnit,
  onAgriUnitChange,
  area,
  onAreaChange,
  bonuses,
  onBonusesChange,
  errors,
}: AgriculturalDetailsProps) {
  const { t } = useLanguage();
  return (
    <Card title={t('agricultural.step')}>
      <FormField htmlFor="agriType" label={t('agricultural.category')} required>
        <Select
          id="agriType"
          value={agriType}
          onChange={(e) => onAgriTypeChange(e.target.value as AgriTypeKey)}
        >
          <option value="agri_nh_sh">{t('agricultural.nhSh')}</option>
          <option value="agri_dist_expwy">{t('agricultural.distExpwy')}</option>
          <option value="agri_link_road">{t('agricultural.linkRoad')}</option>
          <option value="agri_general">{t('agricultural.general')}</option>
        </Select>
      </FormField>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField htmlFor="agriUnit" label={t('agricultural.unit')} required>
          <Select
            id="agriUnit"
            value={agriUnit}
            onChange={(e) => onAgriUnitChange(e.target.value as AgriUnit)}
          >
            <option value="ha">{t('agricultural.hectare')}</option>
            <option value="sqm">{t('agricultural.sqm')}</option>
            <option value="acre">{t('agricultural.acre')}</option>
            <option value="bigha">{t('agricultural.bigha')}</option>
          </Select>
        </FormField>
        <FormField htmlFor="agriArea" label={t('agricultural.area')} required error={errors.agriArea}>
          <TextInput
            id="agriArea"
            type="number"
            step="0.001"
            min="0"
            value={area ?? ''}
            invalid={!!errors.agriArea}
            onChange={(e) => onAreaChange(e.target.value ? Number(e.target.value) : null)}
          />
        </FormField>
      </div>

      <div style={{ borderTop: '1px dashed var(--color-border)', marginTop: 14, paddingTop: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--color-muted)', marginBottom: 10 }}>
          {t('agricultural.bonusesTitle')}
        </div>
        <Checkline
          id="agriSegBonus"
          label={t('agricultural.segmentBonus')}
          hint={t('agricultural.bonusPct25')}
          checked={bonuses.segmentRoad}
          onChange={(checked) => onBonusesChange({ segmentRoad: checked })}
        />
        <Checkline
          id="agriRingBonus"
          label={t('agricultural.ringBonus')}
          hint={t('agricultural.bonusPct25')}
          checked={bonuses.ringRoad}
          onChange={(checked) => onBonusesChange({ ringRoad: checked })}
        />
        <Checkline
          id="agriAabadiBonus"
          label={t('agricultural.aabadiBonus')}
          hint={t('agricultural.bonusPct15')}
          checked={bonuses.aabadiProximity}
          onChange={(checked) => onBonusesChange({ aabadiProximity: checked })}
        />
        <Note badge={t('boundary.ruleBadge')}>{t('agricultural.sourceNote')}</Note>
      </div>
    </Card>
  );
}
