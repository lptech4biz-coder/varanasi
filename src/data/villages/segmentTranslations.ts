/**
 * English translations for the 34 road segment descriptions (Part-2, Form-3)
 * from the Pindra Tehsil 2026 circle rate list.
 *
 * The official gazette from the Office of Sub-Registrar Pindra is published
 * exclusively in Hindi. This lookup provides clear, English-transliterated
 * route descriptions for users who have selected English language mode.
 */
export const segmentDescriptionsEn: Record<number, string> = {
  1: 'On Varanasi-Jaunpur Road: Chamav to Harhua Police Chowki',
  2: 'On Varanasi-Jaunpur Road: Beyond Harhua Police Chowki up to Reliance Petrol Pump',
  3: 'On Varanasi-Jaunpur Road: Beyond Reliance Petrol Pump to start of Airport Colony boundary wall',
  4: 'On Varanasi-Jaunpur Road: Airport Colony boundary wall to outer boundary of Airport',
  5: 'On Varanasi-Jaunpur Road: Outer boundary of Airport to Surendra Patel Statue in Pindra',
  6: 'Surendra Patel Statue to Pindra Power House',
  7: 'On Varanasi-Jaunpur Road: Pindra Power House to Phoolpur Police Station',
  8: 'On Varanasi-Jaunpur Road: Beyond Phoolpur Police Station up to Surahi Road',
  9: 'On Varanasi-Jaunpur Road: Beyond Surahi Road up to Pindra Tehsil boundary (towards Jaunpur)',
  10: 'Harhua Chauraha to Rameshwar Road',
  11: 'Harhua Chauraha to Bhelkha - Panchkoshi Road',
  12: 'Garhwa Chauraha to Birapatti Railway Crossing, and from Birapatti Railway Crossing via Undi to Sutbalpur Gate',
  13: 'Birapatti Railway Crossing via Sikandarpur to Panchkoshi Road',
  14: 'Babatpur to Chaubeypur Road: From Babatpur Airport T-junction towards Mangari via Karmi Primary School, Mangari Railway Crossing, Krishnadev Inter College Mangari, Premnagar Market to Palhipatti Chauraha up to Tehsil boundary',
  15: 'From Mangari Railway Crossing T-junction via Gangapur Chauraha and Petrol Pump to Babatpur-Chaubeypur Road (T-junction)',
  16: 'Mangari to Sindhora Road',
  17: 'Babatpur-Kapsethi Road: Both sides of road from Babatpur Chauraha to Badagaon Trimuhani Union Bank and Yash Hotel & Restaurant',
  18: 'Babatpur-Kapsethi Road: Both sides of road from Badagaon Union Bank / Yash Hotel via Namapur and Ishipur, Kurun Trimuhani to Varuna River Bridge',
  19: 'Badagaon to Kaniyar Mod: From Badagaon Trimuhani Union Bank through Badagaon Market and Gangkala Market up to Kaniyar Mod',
  20: 'Beyond Kaniyar Mod via Sadhoganj Market and Anei Market to Saipur Chauraha up to Kurun Trimuhani',
  21: 'Basni Trimuhani via Kuar on Jamalapur Road up to Tehsil boundary',
  22: 'Kuar to Kathiraon Road',
  23: 'Anei to Rampur Road',
  24: 'Mirashah to Kathiraon Road',
  25: 'Bhojubeer to Thanagaddi Road',
  26: 'Sindhora Market: Police Chowki Sindhora to Union Bank of India Sindhora Branch (Varanasi-Thanagaddi Road)',
  27: 'Sindhora Market: Union Bank of India Sindhora boundary to Sayyed Baba Mazar (Varanasi-Thanagaddi Road)',
  28: 'Sindhora Market: From Shivpujan Singh Katra entrance into Sindhora Market up to Swami Parmanand Public School',
  29: 'Sindhora-Dharsona Road: From Sindhora Chaumuhani to Marui Chhataon Food Co-operative Society Ltd',
  30: 'Sindhora-Dharsona Road: From Marui Chhataon Food Co-operative Society Ltd to Pindra Tehsil boundary',
  31: 'Phoolpur to Sindhora Road',
  32: 'Ring Road Phase-1: Wajidpur to Pindra Tehsil boundary',
  33: 'Pindra Bypass Road: ITI School Kaithauli to UPSIDC boundary wall',
  34: 'Ring Road Phase-2: Wajidpur to Pindra Tehsil boundary',
};

/**
 * Returns the segment description appropriate for the active language.
 */
export function getSegmentDescription(
  segNo: number,
  fallbackDesc: string,
  language: 'hi' | 'en',
): string {
  if (language === 'en' && segmentDescriptionsEn[segNo]) {
    return segmentDescriptionsEn[segNo];
  }
  return fallbackDesc;
}
