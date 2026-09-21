import { useCallback, useMemo, useState } from 'react';
import { villages } from '../../../data/villages';
import type { Village } from '../types';

function normalizeLatin(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function villageMatches(village: Village, queryDevanagari: string, queryLatin: string): boolean {
  if (queryDevanagari && village.name.includes(queryDevanagari)) return true;
  if (queryLatin && normalizeLatin(village.en).includes(queryLatin)) return true;
  return false;
}

/**
 * Village search with Hindi and Hinglish/English matching, ranked so that
 * prefix matches ("Aharak") sort above mid-string matches ("Kaharaka") --
 * standard autocomplete behaviour, ported from the original vanilla-JS app.
 */
export function useVillageSearch() {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  const matches = useMemo<Village[]>(() => {
    const trimmed = query.trim();
    if (trimmed.length === 0) return [];
    const queryLatin = normalizeLatin(trimmed);

    const filtered = villages.filter((v) => villageMatches(v, trimmed, queryLatin));
    filtered.sort((a, b) => {
      const rank = (v: Village) =>
        v.name.startsWith(trimmed) || normalizeLatin(v.en).startsWith(queryLatin) ? 0 : 1;
      return rank(a) - rank(b);
    });
    return filtered.slice(0, 30);
  }, [query]);

  const open = useCallback((value: string) => {
    setQuery(value);
    setActiveIndex(-1);
    setIsOpen(value.trim().length > 0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  const moveActive = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((prev) => {
        const next = prev + direction;
        if (next < 0) return 0;
        if (next >= matches.length) return matches.length - 1;
        return next;
      });
    },
    [matches.length],
  );

  return {
    query,
    setQuery: open,
    matches,
    isOpen,
    activeIndex,
    moveActive,
    close,
    /** Reset the visible search text to a chosen village's bilingual label. */
    showSelected: (village: Village) => setQuery(`${village.name} (${village.en})`),
  };
}
