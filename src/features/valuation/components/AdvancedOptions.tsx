import type { ReactNode } from 'react';
import { useLanguage } from '../../../i18n';
import styles from './AdvancedOptions.module.css';

interface AdvancedOptionsProps {
  children: ReactNode;
}

/**
 * Groups the least-commonly-needed sections (construction, trees, other
 * assets) behind a native <details> disclosure, collapsed by default, so
 * the common calculation path stays short. Matches the original app's
 * progressive-disclosure UX pattern.
 */
export function AdvancedOptions({ children }: AdvancedOptionsProps) {
  const { t } = useLanguage();
  return (
    <div className={styles.section} aria-label={t('advanced.stepTitle')}>
      <div className={styles.header}>
        <span className={styles.title}>{t('advanced.stepTitle')}</span>
        <span className={styles.badge}>{t('advanced.badge')}</span>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
