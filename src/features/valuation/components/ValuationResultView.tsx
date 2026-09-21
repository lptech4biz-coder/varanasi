import { Fragment } from 'react';
import { useLanguage } from '../../../i18n';
import { presentValuation } from '../utils/breakdownPresenter';
import { numberToWords } from '../utils/numberToWords';
import { formatINR } from '../../../utils/format';
import type { CalculationSection } from '../types';
import styles from './ValuationResultView.module.css';

interface ValuationResultViewProps {
  sections: CalculationSection[];
  total: number;
}

export function ValuationResultView({ sections, total }: ValuationResultViewProps) {
  const { t, language } = useLanguage();
  const display = presentValuation(sections, t);

  return (
    <div className={styles.card} role="status">
      <h2 className={styles.title}>{t('result.title')}</h2>
      <div className={styles.amount}>{formatINR(total)}</div>
      <div className={styles.amountWords}>{numberToWords(total, language)}</div>
      <table className={styles.breakdown}>
        <tbody>
          {display.sections.map((section, sIndex) => (
            <Fragment key={sIndex}>
              <tr className={styles.sectionRow}>
                <td colSpan={2}>{section.title}</td>
              </tr>
              {section.rows.map((row, rIndex) => (
                <tr key={rIndex}>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
              <tr>
                <td />
                <td className={styles.subtotal}>
                  {t('result.subtotal')}: {formatINR(section.subtotal)}
                </td>
              </tr>
            </Fragment>
          ))}
          <tr className={styles.totalRow}>
            <td colSpan={2}>
              {t('result.total')} = {formatINR(total)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
