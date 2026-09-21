import { useLanguage } from '../../../i18n';
import { Card } from '../../../components/common/Card';
import { ToggleGroup } from '../../../components/common/ToggleGroup';
import type { PropertyType } from '../types';

interface PropertyTypeSelectorProps {
  value: PropertyType;
  onChange: (value: PropertyType) => void;
}

export function PropertyTypeSelector({ value, onChange }: PropertyTypeSelectorProps) {
  const { t } = useLanguage();
  return (
    <Card title={t('propertyType.step')}>
      <ToggleGroup
        aria-label={t('propertyType.step')}
        value={value}
        onChange={onChange}
        options={[
          { value: 'res', label: t('propertyType.residential') },
          { value: 'comm', label: t('propertyType.commercial') },
          { value: 'indust', label: t('propertyType.industrial') },
          { value: 'agri', label: t('propertyType.agricultural') },
        ]}
      />
    </Card>
  );
}
