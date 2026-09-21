import { useLanguage } from '../../i18n';
import styles from './AppFooter.module.css';

export function AppFooter() {
  const { t } = useLanguage();
  return (
    <footer className={styles.footerContainer} aria-label="Important Notes and Disclaimers">
      <div className={styles.noteCard}>
        <div className={styles.noteHeader}>
          <span className={styles.noteIcon} aria-hidden="true">📌</span>
          <h3 className={styles.noteTitle}>{t('footer.noteTitle')}</h3>
        </div>
        <div className={styles.noteContent}>
          <p className={styles.noteParagraph}>{t('footer.text')}</p>
          <p className={styles.noteParagraph}>{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}

