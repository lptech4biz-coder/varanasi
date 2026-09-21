import { useEffect, useRef } from 'react';
import { HiXMark, HiPrinter, HiCalculator } from 'react-icons/hi2';
import { useLanguage } from '../../../i18n';
import { ValuationResultView } from './ValuationResultView';
import type { CalculationSection } from '../types';
import styles from './ResultModal.module.css';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: CalculationSection[];
  total: number;
}

export function ResultModal({ isOpen, onClose, sections, total }: ResultModalProps) {
  const { t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      data-testid="result-modal-backdrop"
    >
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-modal-title"
      >
        <div className={styles.header}>
          <div className={styles.headerTitleWrap}>
            <span className={styles.headerIcon}>
              <HiCalculator />
            </span>
            <h2 id="result-modal-title" className={styles.headerTitle}>
              {t('result.title')}
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label={t('result.closeModal')}
          >
            <HiXMark />
          </button>
        </div>

        <div className={styles.body}>
          <ValuationResultView sections={sections} total={total} />
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.printBtn}`}
            onClick={handlePrint}
          >
            <HiPrinter />
            {t('result.print')}
          </button>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.closeActionBtn}`}
            onClick={onClose}
          >
            <HiXMark />
            {t('result.closeModal')}
          </button>
        </div>
      </div>
    </div>
  );
}
