import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  title?: ReactNode;
  titleExtra?: ReactNode;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}

export function Card({ title, titleExtra, optional, children, className }: CardProps) {
  return (
    <div className={[styles.card, optional ? styles.optional : '', className].filter(Boolean).join(' ')}>
      {title && (
        <h2 className={styles.title}>
          <span>{title}</span>
          {titleExtra && <span className={styles.titleExtra}>{titleExtra}</span>}
        </h2>
      )}
      {children}
    </div>
  );
}
