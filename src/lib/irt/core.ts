/**
 * IRT 3PL Mathematical Core
 * Implements the 3-Parameter Logistic Model for Computerized Adaptive Testing.
 * 
 * Based on IRT_3PL_SPECIFICATION.md
 */

// Constant D for 3PL scaling to normal ogive metric
export const D = 1.7;

/**
 * Calculates the probability of a correct response based on the 3PL model.
 * 
 * @param theta - Student's ability level (typically -3.0 to +3.0)
 * @param a - Item discrimination parameter
 * @param b - Item difficulty parameter
 * @param c - Item pseudo-guessing parameter
 * @returns Probability of answering correctly P_i(θ)
 */
export function calculate3PLProbability(
  theta: number,
  a: number,
  b: number,
  c: number
): number {
  // P_i(θ) = c_i + (1 - c_i) / (1 + e^(-D * a_i * (θ - b_i)))
  const exponent = -D * a * (theta - b);
  const p = c + (1 - c) / (1 + Math.exp(exponent));
  return p;
}

/**
 * Calculates the Fisher Information for a single item at a given ability level.
 * 
 * @param theta - Student's ability level
 * @param a - Item discrimination parameter
 * @param b - Item difficulty parameter
 * @param c - Item pseudo-guessing parameter
 * @returns Information value I_i(θ)
 */
export function calculateItemInformation(
  theta: number,
  a: number,
  b: number,
  c: number
): number {
  const p = calculate3PLProbability(theta, a, b, c);
  
  // To avoid division by zero if P approaches 1.0 perfectly (which shouldn't happen with standard bounds)
  if (p === 1 || p === c) return 0;

  // I_i(θ) = [ D^2 * a^2 * (1 - P) * (P - c)^2 ] / [ (1 - c)^2 * P ]
  const numerator = Math.pow(D, 2) * Math.pow(a, 2) * (1 - p) * Math.pow(p - c, 2);
  const denominator = Math.pow(1 - c, 2) * p;
  
  return numerator / denominator;
}

/**
 * Calculates the Standard Error (SE) given total test information.
 * 
 * @param totalInformation - Sum of item information for all administered items
 * @returns Standard Error SE(θ)
 */
export function calculateStandardError(totalInformation: number): number {
  if (totalInformation <= 0) return Number.MAX_VALUE; // Maximum uncertainty if no info
  return 1 / Math.sqrt(totalInformation);
}
