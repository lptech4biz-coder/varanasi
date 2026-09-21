import type { ReactNode } from 'react';
import styles from './Note.module.css';

interface NoteProps {
  children: ReactNode;
  badge?: string;
  tone?: 'default' | 'warn';
}

export function Note({ children, badge, tone = 'default' }: NoteProps) {
  return (
    <div className={[styles.note, tone === 'warn' ? styles.warn : ''].filter(Boolean).join(' ')}>
      {children}
      {badge && <span className={styles.badge}>{badge}</span>}
    </div>
  );
}
