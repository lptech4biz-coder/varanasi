import { useLanguage } from '../../../i18n';
import { Card } from '../../../components/common/Card';
import { Checkline } from '../../../components/common/Checkline';
import { Note } from '../../../components/common/Note';
import type { BoundaryConditions as BoundaryConditionsState } from '../types';

interface BoundaryConditionsProps {
  value: BoundaryConditionsState;
  onChange: (patch: Partial<BoundaryConditionsState>) => void;
}

export function BoundaryConditions({ value, onChange }: BoundaryConditionsProps) {
  const { t } = useLanguage();
  return (
    <Card title={t('boundary.step')} titleExtra={<span>{t('boundary.optionalNote')}</span>}>
      <Checkline
        id="bMultiRoad"
        label={t('boundary.multiRoad')}
        hint={t('boundary.multiRoadHint')}
        checked={value.multiRoad}
        onChange={(checked) => onChange({ multiRoad: checked })}
      />
      <Checkline
        id="bPark"
        label={t('boundary.park')}
        hint={t('boundary.parkHint')}
        checked={value.park}
        onChange={(checked) => onChange({ park: checked })}
      />
      <Note badge={t('boundary.ruleBadge')}>{t('boundary.sourceNote')}</Note>
    </Card>
  );
}
