import styles from './ToggleGroup.module.css';

export interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

interface ToggleGroupProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  tone?: 'default' | 'agri' | 'indust';
  'aria-label'?: string;
}

export function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  tone = 'default',
  'aria-label': ariaLabel,
}: ToggleGroupProps<T>) {
  const toneClass = tone === 'agri' ? styles.agri : tone === 'indust' ? styles.indust : '';
  return (
    <div className={styles.group} role="group" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={[
            styles.toggle,
            value === opt.value ? styles.active : '',
            value === opt.value ? toneClass : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
