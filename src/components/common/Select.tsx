import { forwardRef, type SelectHTMLAttributes } from 'react';
import styles from './Select.module.css';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...rest },
  ref,
) {
  return (
    <select ref={ref} className={[styles.select, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </select>
  );
});
