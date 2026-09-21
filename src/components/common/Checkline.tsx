import type { ChangeEvent } from 'react';
import styles from './Checkline.module.css';

interface ChecklineProps {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Checkline({ id, label, hint, checked, onChange }: ChecklineProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked);
  return (
    <label htmlFor={id} className={styles.line}>
      <input id={id} type="checkbox" checked={checked} onChange={handleChange} />
      <span className={styles.text}>
        {label}
        {hint && <small className={styles.hint}>{hint}</small>}
      </span>
    </label>
  );
}
