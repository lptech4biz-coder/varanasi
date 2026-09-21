import { useLanguage } from '../../i18n';
import styles from './AppFooter.module.css';

export function AppFooter() {
  const { t } = useLanguage();
  return (
    <div className={styles.footnote}>
      {t('footer.text')}
      <br />
      {t('footer.disclaimer')}
    </div>
  );
}
