import { useLanguage } from '../../../i18n';
import { Card } from '../../../components/common/Card';
import { Checkline } from '../../../components/common/Checkline';
import { FormField } from '../../../components/common/FormField';
import { Select } from '../../../components/common/Select';
import { TextInput } from '../../../components/common/TextInput';
import { Note } from '../../../components/common/Note';
import type { BuildClass, BuildFloorTier, BuildType, ConstructionDraft } from '../types';

interface ConstructionDetailsProps {
  value: ConstructionDraft;
  onChange: (patch: Partial<ConstructionDraft>) => void;
}

export function ConstructionDetails({ value, onChange }: ConstructionDetailsProps) {
  const { t } = useLanguage();
  const hasFloorTier = value.buildType === 'rcc' || value.buildType === 'rbc';
  const hasClass = hasFloorTier || value.buildType === 'kadi';

  return (
    <Card
      title={t('construction.stepTitle')}
      titleExtra={<span>{t('construction.optionalNote')}</span>}
      optional
    >
      <Checkline
        id="includeConstruction"
        label={t('construction.include')}
        checked={value.included}
        onChange={(checked) => onChange({ included: checked })}
      />
      {value.included && (
        <div>
          <FormField htmlFor="buildType" label={t('construction.type')} optionalTag="(optional)">
            <Select
              id="buildType"
              value={value.buildType}
              onChange={(e) => onChange({ buildType: e.target.value as BuildType })}
            >
              <option value="rcc">{t('construction.rcc')}</option>
              <option value="rbc">{t('construction.rbc')}</option>
              <option value="kadi">{t('construction.kadi')}</option>
              <option value="tin">{t('construction.tin')}</option>
              <option value="kuchcha">{t('construction.kuchcha')}</option>
              <option value="commercial">{t('construction.commercial')}</option>
              <option value="pmcm">{t('construction.pmcm')}</option>
            </Select>
          </FormField>

          {(hasClass || hasFloorTier) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {hasClass && (
                <FormField htmlFor="buildClass" label={t('construction.class')} optionalTag="(optional)">
                  <Select
                    id="buildClass"
                    value={value.buildClass}
                    onChange={(e) => onChange({ buildClass: Number(e.target.value) as BuildClass })}
                  >
                    <option value={0}>{t('construction.class1')}</option>
                    <option value={1}>{t('construction.class2')}</option>
                  </Select>
                </FormField>
              )}
              {hasFloorTier && (
                <FormField
                  htmlFor="buildFloorTier"
                  label={t('construction.floorTier')}
                  optionalTag="(optional)"
                >
                  <Select
                    id="buildFloorTier"
                    value={value.buildFloorTier}
                    onChange={(e) => onChange({ buildFloorTier: Number(e.target.value) as BuildFloorTier })}
                  >
                    <option value={3}>{t('construction.tier3')}</option>
                    <option value={4}>{t('construction.tier4')}</option>
                    <option value={5}>{t('construction.tier5')}</option>
                  </Select>
                </FormField>
              )}
            </div>
          )}

          <FormField htmlFor="coveredArea" label={t('construction.coveredArea')} optionalTag="(optional)">
            <TextInput
              id="coveredArea"
              type="number"
              step="0.01"
              min="0"
              value={value.coveredArea ?? ''}
              onChange={(e) => onChange({ coveredArea: e.target.value ? Number(e.target.value) : null })}
            />
          </FormField>
          <Note badge={t('construction.ruleBadge')}>{t('construction.note')}</Note>
        </div>
      )}
    </Card>
  );
}
