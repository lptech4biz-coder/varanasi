import '@testing-library/jest-dom';
import { afterEach } from 'vitest';

// jsdom does not implement scrollIntoView; the app calls it for a real UX
// nicety (scroll to error / scroll to result) that has no bearing on
// correctness, so a no-op polyfill keeps tests focused on behaviour that
// matters instead of failing on an unrelated jsdom gap.
if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}

const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (i: number) => Object.keys(store)[i] ?? null,
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: storageMock,
  writable: true,
  configurable: true,
});

// Ensure each test starts with a clean slate: without this, a test that
// switches language (which persists to localStorage) would leak into the
// next test's initial render.
afterEach(() => {
  window.localStorage.clear();
});

