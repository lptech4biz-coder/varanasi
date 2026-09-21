import { useLanguage } from '../../../i18n';
import { Card } from '../../../components/common/Card';
import { Select } from '../../../components/common/Select';
import { TextInput } from '../../../components/common/TextInput';
import { Button } from '../../../components/common/Button';
import { Note } from '../../../components/common/Note';
import type { TreeAge, TreeEntry, TreeType } from '../types';
import styles from './TreeValuation.module.css';

interface TreeValuationProps {
  trees: TreeEntry[];
  onAdd: () => void;
  onUpdate: (id: number, patch: Partial<TreeEntry>) => void;
  onRemove: (id: number) => void;
}

export function TreeValuation({ trees, onAdd, onUpdate, onRemove }: TreeValuationProps) {
  const { t } = useLanguage();
  return (
    <Card title={t('trees.stepTitle')} titleExtra={<span>{t('trees.optionalNote')}</span>} optional>
      {trees.map((tree) => (
        <div key={tree.id} className={styles.row}>
          <div>
            <label className={styles.label}>{t('trees.type')}</label>
            <Select
              value={tree.type}
              onChange={(e) => onUpdate(tree.id, { type: e.target.value as TreeType })}
            >
              <option value="faldar">{t('trees.faldar')}</option>
              <option value="imarati">{t('trees.imarati')}</option>
              <option value="anya">{t('trees.anya')}</option>
              <option value="bans">{t('trees.bans')}</option>
            </Select>
          </div>
          {tree.type !== 'bans' && (
            <div>
              <label className={styles.label}>{t('trees.age')}</label>
              <Select
                value={tree.age}
                onChange={(e) => onUpdate(tree.id, { age: e.target.value as TreeAge })}
              >
                <option value="5">{t('trees.age5')}</option>
                <option value="10">{t('trees.age10')}</option>
                <option value="above">{t('trees.ageAbove')}</option>
              </Select>
            </div>
          )}
          <div>
            <label className={styles.label}>{t('trees.qty')}</label>
            <TextInput
              type="number"
              min="1"
              step="1"
              value={tree.qty}
              onChange={(e) => onUpdate(tree.id, { qty: Number(e.target.value) || 0 })}
            />
          </div>
          <button
            type="button"
            className={styles.removeBtn}
            title={t('trees.remove')}
            aria-label={t('trees.remove')}
            onClick={() => onRemove(tree.id)}
          >
            ✕
          </button>
        </div>
      ))}
      <Button variant="ghost" type="button" onClick={onAdd}>
        + {t('trees.addTree')}
      </Button>
      <Note badge={t('boundary.ruleBadge')}>{t('trees.note')}</Note>
    </Card>
  );
}
