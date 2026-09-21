import { describe, it, expect } from 'vitest';
import { numberToWordsHindi, numberToWordsEnglish, numberToWords } from './numberToWords';

describe('numberToWordsHindi', () => {
  it('handles zero', () => {
    expect(numberToWordsHindi(0)).toBe('शून्य');
  });

  it('REGRESSION: correctly renders compound two-digit numbers (34 -> चौंतीस, not तीस चार)', () => {
    // This is the exact bug caught during the original migration: Hindi has a
    // unique word for every number 1-99, it does not compose tens+ones like
    // English does. Do not regress this.
    expect(numberToWordsHindi(34)).toBe('चौंतीस रुपये मात्र');
    expect(numberToWordsHindi(67)).toBe('सड़सठ रुपये मात्र');
    expect(numberToWordsHindi(99)).toBe('निन्यानवे रुपये मात्र');
  });

  it('renders a multi-lakh amount correctly', () => {
    expect(numberToWordsHindi(1234567)).toBe('बारह लाख चौंतीस हज़ार पाँच सौ सड़सठ रुपये मात्र');
  });

  it('renders an exact-crore amount without stray zero segments', () => {
    expect(numberToWordsHindi(6700000)).toBe('सड़सठ लाख रुपये मात्र');
  });

  it('renders a round-thousand amount without a trailing zero segment', () => {
    expect(numberToWordsHindi(1350000)).toBe('तेरह लाख पचास हज़ार रुपये मात्र');
  });
});

describe('numberToWordsEnglish', () => {
  it('handles zero', () => {
    expect(numberToWordsEnglish(0)).toBe('Zero');
  });

  it('renders a multi-lakh amount in Indian numbering (Lakh, not Million)', () => {
    expect(numberToWordsEnglish(1234567)).toBe(
      'Twelve Lakh Thirty Four Thousand Five Hundred Sixty Seven Rupees Only',
    );
  });

  it('renders a crore amount', () => {
    expect(numberToWordsEnglish(15625000)).toBe('One Crore Fifty Six Lakh Twenty Five Thousand Rupees Only');
  });
});

describe('numberToWords (language dispatch)', () => {
  it('dispatches to Hindi', () => {
    expect(numberToWords(100, 'hi')).toBe('एक सौ रुपये मात्र');
  });
  it('dispatches to English', () => {
    expect(numberToWords(100, 'en')).toBe('One Hundred Rupees Only');
  });
});
