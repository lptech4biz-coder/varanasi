import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { hi } from './hi';
import { en } from './en';
import { storageService } from '../services/storageService';
import type { Language } from '../features/valuation/types';

const dictionaries = { hi, en };

/** Recursively join every leaf key path, e.g. "village.searchLabel". */
type Join<K, P> = K extends string ? (P extends string ? `${K}.${P}` : K) : never;
type Leaves<T> = T extends object
  ? { [K in keyof T]: T[K] extends object ? Join<K, Leaves<T[K]>> : K }[keyof T]
  : never;
export type TranslationKey = Leaves<typeof hi>;

function resolve(dict: object, path: string): string {
  const value = path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
  return typeof value === 'string' ? value : path; // fall back to the key itself if missing
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Translate a key, optionally interpolating `{placeholders}`. */
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'lang';

function readInitialLanguage(): Language {
  const saved = storageService.get(STORAGE_KEY);
  return saved === 'en' ? 'en' : 'hi';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    storageService.set(STORAGE_KEY, lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      let text = resolve(dictionaries[language], key);
      if (params) {
        for (const [name, value] of Object.entries(params)) {
          text = text.replace(`{${name}}`, String(value));
        }
      }
      return text;
    },
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
