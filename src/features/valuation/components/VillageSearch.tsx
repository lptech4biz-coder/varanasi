import { useEffect, useRef } from 'react';
import { useLanguage } from '../../../i18n';
import { useVillageSearch } from '../hooks/useVillageSearch';
import { formatINR } from '../../../utils/format';
import { Card } from '../../../components/common/Card';
import { FormField } from '../../../components/common/FormField';
import { TextInput } from '../../../components/common/TextInput';
import type { Village } from '../types';
import styles from './VillageSearch.module.css';

interface VillageSearchProps {
  selectedVillage: Village | null;
  onSelect: (village: Village) => void;
  error?: string;
}

export function VillageSearch({ selectedVillage, onSelect, error }: VillageSearchProps) {
  const { t } = useLanguage();
  const search = useVillageSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedVillage) {
      search.setQuery('');
      search.close();
    } else {
      search.showSelected(selectedVillage);
      search.close();
    }
  }, [selectedVillage]);

  const handleSelect = (village: Village) => {
    onSelect(village);
    search.showSelected(village);
    search.close();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!search.isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      search.moveActive(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      search.moveActive(-1);
    } else if (e.key === 'Enter') {
      if (search.activeIndex >= 0 && search.matches[search.activeIndex]) {
        e.preventDefault();
        handleSelect(search.matches[search.activeIndex]);
      }
    } else if (e.key === 'Escape') {
      search.close();
    }
  };

  return (
    <Card
      title={t('village.step')}
      titleExtra={<span className={styles.requiredTag}>{t('village.required')}</span>}
    >
      <FormField htmlFor="villageSearch" label={t('village.searchLabel')} required error={error}>
        <div className={styles.searchWrap}>
          <TextInput
            ref={inputRef}
            id="villageSearch"
            type="text"
            role="combobox"
            aria-expanded={search.isOpen}
            aria-controls="village-suggestions"
            aria-autocomplete="list"
            aria-required="true"
            aria-activedescendant={
              search.activeIndex >= 0 ? `village-option-${search.activeIndex}` : undefined
            }
            placeholder={t('village.searchPlaceholder')}
            autoComplete="off"
            value={search.query}
            invalid={!!error}
            onChange={(e) => search.setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(search.close, 150)}
          />
          {search.isOpen && (
            <div id="village-suggestions" role="listbox" className={styles.suggestions}>
              {search.matches.length === 0 ? (
                <div className={styles.emptyState}>{t('village.noResults')}</div>
              ) : (
                search.matches.map((village, index) => (
                  <div
                    key={village.sl}
                    id={`village-option-${index}`}
                    role="option"
                    aria-selected={index === search.activeIndex}
                    className={[styles.option, index === search.activeIndex ? styles.optionActive : '']
                      .filter(Boolean)
                      .join(' ')}
                    onMouseDown={() => handleSelect(village)}
                  >
                    <span>
                      {village.name} <span className={styles.enName}>({village.en})</span>
                    </span>
                    <span className={styles.tag}>
                      {village.pargana} · {village.category}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </FormField>

      {selectedVillage && (
        <div className={styles.badge}>
          <div className={styles.item}>
            <span>{t('village.village')}</span>
            <b>
              {selectedVillage.name} ({selectedVillage.en})
            </b>
          </div>
          <div className={styles.item}>
            <span>{t('village.uniqueCode')}</span>
            <b>{selectedVillage.lgd_code ?? t('village.notAvailable')}</b>
          </div>
          <div className={styles.item}>
            <span>{t('village.pargana')}</span>
            <b>{selectedVillage.pargana}</b>
          </div>
          <div className={styles.item}>
            <span>{t('village.category')}</span>
            <b>{selectedVillage.category}</b>
          </div>
          <div className={styles.item}>
            <span>{t('village.basicRate')}</span>
            <b>
              {formatINR(selectedVillage.rate_basic_0_3m)}/{t('village.sqm')}
            </b>
          </div>
        </div>
      )}
    </Card>
  );
}
