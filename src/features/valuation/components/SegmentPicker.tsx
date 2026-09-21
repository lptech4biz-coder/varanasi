import { useLanguage } from '../../../i18n';
import { formatINR } from '../../../utils/format';
import { Card } from '../../../components/common/Card';
import type { SegmentRate } from '../types';
import { getSegmentDescription } from '../../../data/villages/segmentTranslations';
import styles from './SegmentPicker.module.css';

interface SegmentPickerProps {
  segments: SegmentRate[];
  selected: SegmentRate | null;
  onSelect: (segment: SegmentRate | null) => void;
}

export function SegmentPicker({ segments, selected, onSelect }: SegmentPickerProps) {
  const { t, language } = useLanguage();
  if (segments.length === 0) return null;

  return (
    <Card title={t('segment.step')} titleExtra={<span>{t('segment.optionalNote')}</span>}>
      <label className={styles.line}>
        <input
          type="radio"
          name="segmentChoice"
          checked={selected === null}
          onChange={() => onSelect(null)}
        />
        <span>{t('segment.none')}</span>
      </label>
      {segments.map((segment, index) => (
        <label key={index} className={styles.line}>
          <input
            type="radio"
            name="segmentChoice"
            checked={selected === segment}
            onChange={() => onSelect(segment)}
          />
          <span className={styles.text}>
            {getSegmentDescription(segment.seg_no, segment.seg_desc, language)}
            <small className={styles.hint}>
              {language === 'en' ? segment.village_en : `${segment.village} (${segment.village_en})`} · {t('segment.nonAgri')}:{' '}
              {formatINR(segment.rate_nonagri)}/{t('village.sqm')} · {t('segment.singleShopLand')}:{' '}
              {formatINR(segment.rate_shop_land)}/{t('village.sqm')} · {t('segment.otherCommercialFloor')}:{' '}
              {formatINR(segment.rate_other_floor)}/{t('village.sqm')}
            </small>
          </span>
        </label>
      ))}
    </Card>
  );
}
