import { describe, it, expect } from 'vitest';
import { hi } from './hi';
import { en } from './en';

function flattenKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flattenKeys(value, path);
    }
    return [path];
  });
}

describe('i18n dictionaries', () => {
  it('hi and en have exactly the same set of translation keys', () => {
    // This duplicates what `en.ts`'s `satisfies TranslationDict` already
    // enforces at compile time, but keeps the guarantee visible in the test
    // run output and protects against someone loosening that type later.
    const hiKeys = flattenKeys(hi).sort();
    const enKeys = flattenKeys(en).sort();
    expect(enKeys).toEqual(hiKeys);
  });

  it('no translation value is an empty string', () => {
    for (const [dictName, dict] of [
      ['hi', hi],
      ['en', en],
    ] as const) {
      for (const key of flattenKeys(dict)) {
        const value = key.split('.').reduce<unknown>((acc, part) => (acc as never)[part], dict);
        expect(value, `${dictName}.${key} should not be empty`).not.toBe('');
      }
    }
  });
});
