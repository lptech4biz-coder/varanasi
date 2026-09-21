/**
 * Thin abstraction over localStorage so components never call it directly.
 * Fails silently (matching the original app's behavior) if storage is
 * unavailable -- e.g. private browsing modes in some browsers.
 */
const NAMESPACE = 'pindra_calc_';

export const storageService = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(NAMESPACE + key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      window.localStorage.setItem(NAMESPACE + key, value);
    } catch {
      // Storage unavailable (private browsing, quota, etc.) -- non-fatal.
    }
  },
};
