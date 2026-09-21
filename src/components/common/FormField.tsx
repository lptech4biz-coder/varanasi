import type { ReactNode } from 'react';
import styles from './FormField.module.css';

interface FormFieldProps {
  htmlFor: string;
  label: string;
  required?: boolean;
  optionalTag?: string;
  error?: string | null;
  children: ReactNode;
}

/**
 * Wraps a single form control with a consistent label (with required/optional
 * marker) and an inline, screen-reader-announced error message. Centralizing
 * this here means every field in the app gets the same accessible structure
 * for free, instead of duplicating label/error markup in each component.
 */
export function FormField({ htmlFor, label, required, optionalTag, error, children }: FormFieldProps) {
  const errorId = `${htmlFor}-error`;
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        )}
        {optionalTag && <span className={styles.optional}> {optionalTag}</span>}
      </label>
      {children}
      {error && (
        <div id={errorId} className={styles.error} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
