import { useLanguage } from '../../i18n';
import styles from './LanguageSwitcher.module.css';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className={styles.switch} role="group" aria-label="भाषा चुनें / Choose language">
      <button
        type="button"
        className={language === 'hi' ? styles.active : ''}
        aria-pressed={language === 'hi'}
        onClick={() => setLanguage('hi')}
      >
        हिन्दी
      </button>
      <button
        type="button"
        className={language === 'en' ? styles.active : ''}
        aria-pressed={language === 'en'}
        onClick={() => setLanguage('en')}
      >
        English
      </button>
    </div>
  );
}
