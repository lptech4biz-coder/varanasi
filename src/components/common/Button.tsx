import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'link';
  children: ReactNode;
}

export function Button({ variant = 'primary', className, children, ...rest }: ButtonProps) {
  const variantClass =
    variant === 'primary' ? styles.primary : variant === 'ghost' ? styles.ghost : styles.link;
  return (
    <button className={[styles.button, variantClass, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </button>
  );
}
