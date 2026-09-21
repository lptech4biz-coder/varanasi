import { useLanguage } from '../../../i18n';
import { Card } from '../../../components/common/Card';
import { TextInput } from '../../../components/common/TextInput';
import { Note } from '../../../components/common/Note';
import type { AssetsInput } from '../types';
import styles from './OtherAssets.module.css';

interface OtherAssetsProps {
  value: AssetsInput;
  onChange: (patch: Partial<AssetsInput>) => void;
}

export function OtherAssets({ value, onChange }: OtherAssetsProps) {
  const { t } = useLanguage();
  return (
    <Card title={t('assets.stepTitle')} titleExtra={<span>{t('assets.optionalNote')}</span>} optional>
      <div className={styles.row}>
        <div className={styles.label}>
          {t('assets.borewell')}
          <small>{t('assets.borewellRate')}</small>
        </div>
        <TextInput
          type="number"
          min="0"
          step="1"
          value={value.borewellCount}
          onChange={(e) => onChange({ borewellCount: Number(e.target.value) || 0 })}
        />
      </div>
      <div className={styles.row}>
        <div className={styles.label}>
          {t('assets.kuan')}
          <small>{t('assets.kuanRate')}</small>
        </div>
        <TextInput
          type="number"
          min="0"
          step="1"
          value={value.kuanCount}
          onChange={(e) => onChange({ kuanCount: Number(e.target.value) || 0 })}
        />
      </div>
      <Note badge={t('boundary.ruleBadge')}>{t('assets.note')}</Note>
    </Card>
  );
}
