import { describe, it, expect } from 'vitest';
import { calculate3PLProbability, calculateItemInformation, calculateStandardError } from '../irt/core';
import { estimateThetaMLE, ItemResponse } from '../irt/estimator';
import { selectNextItem, checkStoppingRule, AvailableItem } from '../irt/cat-engine';

describe('IRT 3PL Core Math', () => {
  it('calculates probability correctly (average student, average item)', () => {
    const p = calculate3PLProbability(0, 1.0, 0, 0.2);
    expect(p).toBeCloseTo(0.6, 2);
  });

  it('calculates probability correctly (high ability, easy item)', () => {
    const p = calculate3PLProbability(2.0, 1.0, -1.0, 0.2);
    expect(p).toBeGreaterThan(0.99);
  });

  it('calculates information correctly', () => {
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
      { a: 1.0, b: -1.0, c: 0.2, isCorrect: true },
      { a: 1.0, b: 0, c: 0.2, isCorrect: true },
      { a: 1.0, b: 1.0, c: 0.2, isCorrect: false },
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
  it('selects item with highest information (MFI) and respects Content Balancing', () => {
    const availableItems: AvailableItem[] = [
      { id: '1', irt_a: 1.0, irt_b: -2.0, irt_c: 0.2, sub_domain_code: 'H1' },
      { id: '2', irt_a: 1.0, irt_b: 0.0, irt_c: 0.2, sub_domain_code: 'H2' },
      { id: '3', irt_a: 1.0, irt_b: 2.0, irt_c: 0.2, sub_domain_code: 'H3' },
    ];
    
    // If we've answered H1, the deficit for H2, H3 etc will be higher.
    // It should pick from a domain we haven't answered yet, for example H2 or H3.
    // Let's pass answeredDomains = ['H1']. 
    // It should pick H2 (because between H2 and H3, both have 0 representation, so it picks the first or highest info).
    // Actually, at theta=0, item 2 (H2, b=0) gives max info.
    const nextItem = selectNextItem(0.0, availableItems, ['H1']);
    expect(nextItem?.id).toBe('2');

    // If we answered H1 and H2, and theta=2.0, it should pick H3
    const nextItemHard = selectNextItem(2.0, availableItems, ['H1', 'H2']);
    expect(nextItemHard?.id).toBe('3');
  });

  it('enforces stopping rules properly', () => {
    // min 10 items, max 30 items, target SE 0.3
    
    // Under minimum items (even if SE is amazing)
    expect(checkStoppingRule(100, 5)).toBe(false);
    
    // Over max items (even if SE is terrible)
    expect(checkStoppingRule(1, 30)).toBe(true);

    // Hit SE target after min items (SE = 1/sqrt(16) = 0.25 <= 0.3)
    expect(checkStoppingRule(16, 12)).toBe(true);

    // Not yet hit SE target after min items (SE = 1/sqrt(9) = 0.333 > 0.3)
    expect(checkStoppingRule(9, 12)).toBe(false);
  });
});
