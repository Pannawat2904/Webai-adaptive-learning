import { SubDomainCode } from '@/types/database';
import { calculateItemInformation, calculateStandardError } from './core';
import { CAT_CONFIG } from './config';

export interface AvailableItem {
  id: string;
  irt_a: number | null;
  irt_b: number | null;
  irt_c: number | null;
  sub_domain_code: SubDomainCode;
  irt_calibration_status?: string;
  active?: boolean;
}

/**
 * Calculates which sub-domain is most under-represented based on the target coverage.
 * 
 * @param answeredDomains - Array of sub_domain_codes the student has already answered
 * @returns The sub_domain_code that should be targeted next
 */
function getTargetSubDomain(answeredDomains: SubDomainCode[]): SubDomainCode {
  const totalAnswered = answeredDomains.length;
  if (totalAnswered === 0) {
    // If no questions answered, just pick H1 or any starting point (could be random, let's pick highest weight or H1)
    return 'H1';
  }

  const currentCounts: Record<SubDomainCode, number> = {
    H1: 0, H2: 0, H3: 0, H4: 0, H5: 0, H6: 0, H7: 0, H8: 0
  };

  for (const d of answeredDomains) {
    currentCounts[d]++;
  }

  let mostUnderRepresented: SubDomainCode = 'H1';
  let maxDeficit = -Infinity;

  const domains: SubDomainCode[] = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'];
  for (const d of domains) {
    const currentRatio = currentCounts[d] / totalAnswered;
    const targetRatio = CAT_CONFIG.domainCoverage[d];
    
    // Deficit: how much we are lacking compared to target
    const deficit = targetRatio - currentRatio;

    if (deficit > maxDeficit) {
      maxDeficit = deficit;
      mostUnderRepresented = d;
    }
  }

  return mostUnderRepresented;
}

/**
 * Selects the next best item from the available pool based on Content Balancing and Maximum Fisher Information (MFI).
 * 
 * @param currentTheta - Student's current estimated ability
 * @param availableItems - Pool of questions not yet administered
 * @param answeredDomains - Array of sub_domain_codes the student has already answered
 * @returns The item that provides the highest information at the current theta and matches content balance
 */
export function selectNextItem(
  currentTheta: number, 
  availableItems: AvailableItem[],
  answeredDomains: SubDomainCode[]
): AvailableItem | null {
  if (availableItems.length === 0) return null;

  // Step 1: Filter active and valid items based on MODE
  let validItems = availableItems.filter(item => item.active !== false);
  
  if (CAT_CONFIG.mode === 'production') {
    validItems = validItems.filter(item => item.irt_calibration_status === 'calibrated' && item.irt_a !== null && item.irt_b !== null && item.irt_c !== null);
  } else {
    // In development mode, allow pending items, but we need fallback parameters for MFI calculation if null
    validItems = validItems.map(item => ({
      ...item,
      irt_a: item.irt_a ?? 1.0,
      irt_b: item.irt_b ?? 0.0,
      irt_c: item.irt_c ?? 0.2
    }));
  }

  if (validItems.length === 0) return null;

  // Step 2: Content Balancing
  const targetDomain = getTargetSubDomain(answeredDomains);
  const domainFilteredItems = validItems.filter(i => i.sub_domain_code === targetDomain);

  // If we run out of items in the target domain, fall back to all valid items
  const candidates = domainFilteredItems.length > 0 ? domainFilteredItems : validItems;

  // Step 3: Maximum Fisher Information (MFI) & Exposure Control (simplified for Phase 1)
  let bestItem = candidates[0];
  let maxInformation = -1;

  for (const item of candidates) {
    const info = calculateItemInformation(currentTheta, item.irt_a!, item.irt_b!, item.irt_c!);
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
 * @returns Boolean indicating whether the test should terminate
 */
export function checkStoppingRule(
  totalInformation: number,
  itemsAdministered: number
): boolean {
  // Always stop if we hit the maximum item limit
  if (itemsAdministered >= CAT_CONFIG.maxItems) return true;

  // Never stop before minimum items are administered
  if (itemsAdministered < CAT_CONFIG.minItems) return false;

  // Stop early if we have enough precision (SE <= targetSE)
  const currentSE = calculateStandardError(totalInformation);
  if (currentSE <= CAT_CONFIG.targetSE) return true;

  return false;
}
