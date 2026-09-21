/**
 * Converts a rupee amount into words, Indian numbering system (lakh/crore).
 *
 * NOTE ON A BUG FIXED DURING THE ORIGINAL VANILLA-JS BUILD:
 * An earlier version of this function built two-digit Hindi numbers by
 * concatenating a tens-word and a ones-word English-style ("तीस" + "चार"
 * for 34), which is not how Hindi works -- Hindi has a unique, irregular
 * word for every number 1-99 (34 is "चौंतीस", not "तीस चार"). This was
 * caught via a Node/jsdom regression test during migration and fixed with
 * a full 0-99 lookup table below. Keep the lookup table; do not "simplify"
 * it back to tens+ones composition.
 */

const HINDI_ONES_THROUGH_NINETY_NINE: readonly string[] = [
  'शून्य',
  'एक',
  'दो',
  'तीन',
  'चार',
  'पाँच',
  'छह',
  'सात',
  'आठ',
  'नौ',
  'दस',
  'ग्यारह',
  'बारह',
  'तेरह',
  'चौदह',
  'पन्द्रह',
  'सोलह',
  'सत्रह',
  'अठारह',
  'उन्नीस',
  'बीस',
  'इक्कीस',
  'बाईस',
  'तेईस',
  'चौबीस',
  'पच्चीस',
  'छब्बीस',
  'सत्ताईस',
  'अट्ठाईस',
  'उनतीस',
  'तीस',
  'इकतीस',
  'बत्तीस',
  'तैंतीस',
  'चौंतीस',
  'पैंतीस',
  'छत्तीस',
  'सैंतीस',
  'अड़तीस',
  'उनतालीस',
  'चालीस',
  'इकतालीस',
  'बयालीस',
  'तैंतालीस',
  'चौवालीस',
  'पैंतालीस',
  'छियालीस',
  'सैंतालीस',
  'अड़तालीस',
  'उनचास',
  'पचास',
  'इक्यावन',
  'बावन',
  'तिरपन',
  'चौवन',
  'पचपन',
  'छप्पन',
  'सत्तावन',
  'अट्ठावन',
  'उनसठ',
  'साठ',
  'इकसठ',
  'बासठ',
  'तिरसठ',
  'चौंसठ',
  'पैंसठ',
  'छियासठ',
  'सड़सठ',
  'अड़सठ',
  'उनहत्तर',
  'सत्तर',
  'इकहत्तर',
  'बहत्तर',
  'तिहत्तर',
  'चौहत्तर',
  'पचहत्तर',
  'छिहत्तर',
  'सतहत्तर',
  'अठहत्तर',
  'उन्यासी',
  'अस्सी',
  'इक्यासी',
  'बयासी',
  'तिरासी',
  'चौरासी',
  'पचासी',
  'छियासी',
  'सत्तासी',
  'अट्ठासी',
  'नवासी',
  'नब्बे',
  'इक्यानवे',
  'बानवे',
  'तिरानवे',
  'चौरानवे',
  'पंचानवे',
  'छियानवे',
  'सत्तानवे',
  'अट्ठानवे',
  'निन्यानवे',
];

function hindiThreeDigit(n: number): string {
  if (n < 100) return HINDI_ONES_THROUGH_NINETY_NINE[n];
  const hundreds = HINDI_ONES_THROUGH_NINETY_NINE[Math.floor(n / 100)];
  const remainder = n % 100;
  return `${hundreds} सौ${remainder ? ' ' + HINDI_ONES_THROUGH_NINETY_NINE[remainder] : ''}`;
}

/** Convert a non-negative amount to Hindi words, Indian numbering (लाख/करोड़). */
export function numberToWordsHindi(amount: number): string {
  let num = Math.round(amount);
  if (num === 0) return 'शून्य';

  const parts: string[] = [];
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const rest = num;

  if (crore) parts.push(`${hindiThreeDigit(crore)} करोड़`);
  if (lakh) parts.push(`${hindiThreeDigit(lakh)} लाख`);
  if (thousand) parts.push(`${hindiThreeDigit(thousand)} हज़ार`);
  if (rest) parts.push(hindiThreeDigit(rest));

  return `${parts.join(' ')} रुपये मात्र`;
}

const ENGLISH_ONES: readonly string[] = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];
const ENGLISH_TENS: readonly string[] = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

function englishTwoDigit(n: number): string {
  if (n < 20) return ENGLISH_ONES[n];
  const tens = ENGLISH_TENS[Math.floor(n / 10)];
  const ones = n % 10;
  return ones ? `${tens} ${ENGLISH_ONES[ones]}` : tens;
}

function englishThreeDigit(n: number): string {
  if (n < 100) return englishTwoDigit(n);
  const hundreds = ENGLISH_ONES[Math.floor(n / 100)];
  const remainder = n % 100;
  return `${hundreds} Hundred${remainder ? ' ' + englishTwoDigit(remainder) : ''}`;
}

/** Convert a non-negative amount to English words, Indian numbering (Lakh/Crore). */
export function numberToWordsEnglish(amount: number): string {
  let num = Math.round(amount);
  if (num === 0) return 'Zero';

  const parts: string[] = [];
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const rest = num;

  if (crore) parts.push(`${englishThreeDigit(crore)} Crore`);
  if (lakh) parts.push(`${englishThreeDigit(lakh)} Lakh`);
  if (thousand) parts.push(`${englishThreeDigit(thousand)} Thousand`);
  if (rest) parts.push(englishThreeDigit(rest));

  return `${parts.join(' ')} Rupees Only`;
}

export function numberToWords(amount: number, language: 'hi' | 'en'): string {
  return language === 'en' ? numberToWordsEnglish(amount) : numberToWordsHindi(amount);
}
