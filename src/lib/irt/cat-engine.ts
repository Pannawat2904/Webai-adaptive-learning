import { calculateItemInformation, calculateStandardError } from './core';

export interface AvailableItem {
  id: string;
  a: number;
  b: number;
  c: number;
  sub_domain_code: string;
}

/**
 * Selects the next best item from the available pool based on Maximum Fisher Information (MFI).
 * 
 * @param currentTheta - Student's current estimated ability
 * @param availableItems - Pool of questions not yet administered
 * @returns The item that provides the highest information at the current theta
 */
export function selectNextItemMFI(currentTheta: number, availableItems: AvailableItem[]): AvailableItem | null {
  if (availableItems.length === 0) return null;

  let bestItem = availableItems[0];
  let maxInformation = -1;

  for (const item of availableItems) {
    const info = calculateItemInformation(currentTheta, item.a, item.b, item.c);
    if (info > maxInformation) {
      maxInformation = info;
      bestItem = item;
    }
  }

  return bestItem;
}

/**
 * Checks if the CAT assessment should stop based on predefined rules.
 * 
 * @param totalInformation - Accumulated information from all answered items
 * @param itemsAdministered - Number of items the student has answered so far
 * @param minItems - Minimum items required before stopping (default: 10)
 * @param maxItems - Absolute maximum items allowed (default: 30)
 * @param targetSE - Target Standard Error to achieve before stopping early (default: 0.3)
 * @returns Boolean indicating whether the test should terminate
 */
export function checkStoppingRule(
  totalInformation: number,
  itemsAdministered: number,
  minItems: number = 10,
  maxItems: number = 30,
  targetSE: number = 0.3
): boolean {
  // Always stop if we hit the maximum item limit
  if (itemsAdministered >= maxItems) return true;

  // Never stop before minimum items are administered
  if (itemsAdministered < minItems) return false;

  // Stop early if we have enough precision (SE <= targetSE)
  const currentSE = calculateStandardError(totalInformation);
  if (currentSE <= targetSE) return true;

  return false;
}
