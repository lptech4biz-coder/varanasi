import type { PropertyType, ResidentialMode } from '../types';

export interface RequiredField {
  /** Form field id, used to focus/scroll to the offending control. */
  id: string;
  /** Translation key for the error message shown to the user. */
  messageKey: string;
}

/**
 * Determine which fields are required given the current step of the form.
 * Ported from the original app's `getRequiredFields()` -- the set of
 * required fields depends on which property type and (for residential)
 * which mode is currently selected, so this must be recomputed on every
 * validation pass rather than being a static list.
 */
export function getRequiredFields(
  hasVillage: boolean,
  propertyType: PropertyType,
  residentialMode: ResidentialMode,
): RequiredField[] {
  const required: RequiredField[] = [];

  if (!hasVillage) {
    required.push({ id: 'villageSearch', messageKey: 'error.villageRequired' });
  }

  if (propertyType === 'res') {
    if (residentialMode === 'plot') {
      required.push({ id: 'resArea', messageKey: 'error.areaRequired' });
    } else if (residentialMode === 'flat') {
      required.push({ id: 'flatCarpet', messageKey: 'error.carpetAreaRequired' });
    } else {
      required.push({ id: 'floorArea', messageKey: 'error.areaRequired' });
    }
  } else if (propertyType === 'comm') {
    required.push({ id: 'commArea', messageKey: 'error.areaRequired' });
  } else if (propertyType === 'indust') {
    required.push({ id: 'industArea', messageKey: 'error.areaRequired' });
  } else {
    required.push({ id: 'agriArea', messageKey: 'error.areaRequired' });
  }

  return required;
}

/** A positive, finite number -- the only kind of numeric input this form ever accepts. */
export function isPositiveNumber(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}
