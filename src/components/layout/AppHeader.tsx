import { HiArrowPath, HiBuildingOffice2 } from 'react-icons/hi2';
import { useLanguage } from '../../i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '../common/Button';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  onReset: () => void;
}

export function AppHeader({ onReset }: AppHeaderProps) {
  const { t } = useLanguage();

  const handleReset = () => {
    onReset();
  };

  return (
    <header className={styles.header}>
      <div className={styles.branding}>
        <div className={styles.eyebrow}>
          <HiBuildingOffice2 className={styles.eyebrowIcon} />
          <span>{t('app.officeName')}</span>
        </div>
        <div className={styles.titleLine}>
          <h1 className={styles.title}>{t('app.title')}</h1>
          <span className={styles.subtitle}>{t('app.subtitle')}</span>
        </div>
      </div>

      <div className={styles.topActions}>
        <LanguageSwitcher />
        <Button variant="ghost" onClick={handleReset} className={styles.resetBtn}>
          <HiArrowPath className={styles.resetIcon} />
          <span>{t('app.resetButton')}</span>
        </Button>
      </div>
    </header>
  );
}

