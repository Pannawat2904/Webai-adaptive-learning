import { SubDomainCode } from '@/types/database';

export type IRTMode = 'development' | 'production';

export interface CATConfiguration {
  mode: IRTMode;
  minItems: number;
  maxItems: number;
  targetSE: number;
  domainCoverage: Record<SubDomainCode, number>;
}

/**
 * CAT Engine Configuration
 * 
 * Rules:
 * 1. Mode can be toggled. If 'development', we might use mock/pending IRT parameters.
 *    If 'production', ONLY 'calibrated' items are allowed.
 * 2. minItems, maxItems, and targetSE are configurable.
 * 3. domainCoverage dictates the target percentage distribution of H1-H8.
 */
export const CAT_CONFIG: CATConfiguration = {
  mode: (process.env.NEXT_PUBLIC_IRT_MODE as IRTMode) || 'development',
  minItems: 10,
  maxItems: 30,
  targetSE: 0.30,
  domainCoverage: {
    H1: 0.20,
    H2: 0.20,
    H3: 0.20,
    H4: 0.20,
    H5: 0.20,
  }
};
