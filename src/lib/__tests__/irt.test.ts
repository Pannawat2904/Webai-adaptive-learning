import { describe, it, expect } from 'vitest';
import { calculate3PLProbability, calculateItemInformation, calculateStandardError } from '../irt/core';
import { estimateThetaMLE, ItemResponse } from '../irt/estimator';
import { selectNextItemMFI, checkStoppingRule, AvailableItem } from '../irt/cat-engine';

describe('IRT 3PL Core Math', () => {
  it('calculates probability correctly (average student, average item)', () => {
    // theta=0, a=1.0, b=0, c=0.2
    const p = calculate3PLProbability(0, 1.0, 0, 0.2);
    // e^0 = 1. P = 0.2 + (0.8)/2 = 0.2 + 0.4 = 0.6
    expect(p).toBeCloseTo(0.6, 2);
  });

  it('calculates probability correctly (high ability, easy item)', () => {
    const p = calculate3PLProbability(2.0, 1.0, -1.0, 0.2);
    // exponent = -1.7 * 1.0 * (2 - (-1)) = -5.1
    // P = 0.2 + 0.8 / (1 + e^-5.1) ~= 0.2 + 0.8 / (1.006) ~= 0.99
    expect(p).toBeGreaterThan(0.99);
  });

  it('calculates information correctly', () => {
    // Information is maximized near b = theta
    const infoMatch = calculateItemInformation(0, 1.0, 0, 0.2);
    const infoMismatch = calculateItemInformation(0, 1.0, 2.0, 0.2);
    expect(infoMatch).toBeGreaterThan(infoMismatch);
  });

  it('calculates Standard Error (SE)', () => {
    expect(calculateStandardError(4.0)).toBe(0.5); // 1 / sqrt(4) = 0.5
    expect(calculateStandardError(100.0)).toBe(0.1);
  });
});

describe('MLE Estimator', () => {
  it('estimates theta near 0 for mixed responses', () => {
    const responses: ItemResponse[] = [
      { a: 1.0, b: -1.0, c: 0.2, isCorrect: true }, // easy item, got right
      { a: 1.0, b: 0, c: 0.2, isCorrect: true },    // medium item, got right
      { a: 1.0, b: 1.0, c: 0.2, isCorrect: false }, // hard item, got wrong
    ];
    const theta = estimateThetaMLE(responses, 0);
    expect(theta).toBeGreaterThan(-1);
    expect(theta).toBeLessThan(1);
  });

  it('bounds theta to 3.0 for all correct responses', () => {
    const responses: ItemResponse[] = [
      { a: 1.0, b: 1.0, c: 0.2, isCorrect: true },
    ];
    const theta = estimateThetaMLE(responses, 0);
    expect(theta).toBe(3.0);
  });
});

describe('CAT Engine', () => {
  it('selects item with highest information (MFI)', () => {
    const availableItems: AvailableItem[] = [
      { id: '1', a: 1.0, b: -2.0, c: 0.2, sub_domain_code: 'H1' },
      { id: '2', a: 1.0, b: 0.0, c: 0.2, sub_domain_code: 'H2' },
      { id: '3', a: 1.0, b: 2.0, c: 0.2, sub_domain_code: 'H3' },
    ];
    
    // For theta = 0, item 2 (b=0.0) should give the highest information
    const nextItem = selectNextItemMFI(0.0, availableItems);
    expect(nextItem?.id).toBe('2');

    // For theta = 2.0, item 3 (b=2.0) should give highest information
    const nextItemHard = selectNextItemMFI(2.0, availableItems);
    expect(nextItemHard?.id).toBe('3');
  });

  it('enforces stopping rules properly', () => {
    // min 10 items, max 30 items, target SE 0.3
    
    // Under minimum items (even if SE is amazing)
    expect(checkStoppingRule(100, 5, 10, 30, 0.3)).toBe(false);
    
    // Over max items (even if SE is terrible)
    expect(checkStoppingRule(1, 30, 10, 30, 0.3)).toBe(true);

    // Hit SE target after min items
    // SE = 1/sqrt(16) = 0.25 (which is <= 0.3)
    expect(checkStoppingRule(16, 12, 10, 30, 0.3)).toBe(true);

    // Not yet hit SE target after min items
    // SE = 1/sqrt(9) = 0.333 (which is > 0.3)
    expect(checkStoppingRule(9, 12, 10, 30, 0.3)).toBe(false);
  });
});
