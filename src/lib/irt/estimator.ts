import { calculate3PLProbability } from './core';

export interface ItemResponse {
  a: number; // discrimination
  b: number; // difficulty
  c: number; // pseudo-guessing
  isCorrect: boolean; // 1 for correct, 0 for incorrect
}

/**
 * Maximum Likelihood Estimation (MLE) using Newton-Raphson method
 * to estimate the student's ability (theta).
 * 
 * @param responses - Array of items administered and the student's responses
 * @param initialTheta - Starting value for theta estimation (default: 0)
 * @returns Estimated theta (capped between -3.0 and +3.0)
 */
export function estimateThetaMLE(responses: ItemResponse[], initialTheta: number = 0): number {
  if (responses.length === 0) return initialTheta;

  // Check if all responses are correct or all are incorrect
  // MLE cannot estimate theta for perfect or zero scores (it approaches infinity)
  const allCorrect = responses.every(r => r.isCorrect);
  const allIncorrect = responses.every(r => !r.isCorrect);
  
  if (allCorrect) return 3.0;
  if (allIncorrect) return -3.0;

  let currentTheta = initialTheta;
  const MAX_ITERATIONS = 20;
  const CONVERGENCE_THRESHOLD = 0.001;

  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    let firstDerivative = 0;
    let secondDerivative = 0;

    for (const response of responses) {
      const p = calculate3PLProbability(currentTheta, response.a, response.b, response.c);
      
      // Avoid log(0) or division by zero
      if (p === 1 || p === 0) continue;

      const q = 1 - p;
      const u = response.isCorrect ? 1 : 0;
      
      // Constants for derivatives (assuming D=1.7 is inside calculate3PLProbability)
      const D = 1.7;
      
      // First derivative of log-likelihood
      const pPrime = D * response.a * (p - response.c) * (1 - p) / (1 - response.c);
      firstDerivative += (u - p) * pPrime / (p * q);

      // Second derivative
      const pDoublePrime = D * response.a * pPrime * (1 - 2 * p + response.c) / (1 - response.c);
      secondDerivative += ((u * pDoublePrime / p) - (u * Math.pow(pPrime, 2) / Math.pow(p, 2)))
                          - (((1 - u) * pDoublePrime / q) + ((1 - u) * Math.pow(pPrime, 2) / Math.pow(q, 2)));
    }

    if (Math.abs(secondDerivative) < 1e-8) break; // Prevent division by very small number

    const delta = firstDerivative / secondDerivative;
    currentTheta = currentTheta - delta;

    // Boundary constraints for theta
    if (currentTheta > 3.0) currentTheta = 3.0;
    if (currentTheta < -3.0) currentTheta = -3.0;

    if (Math.abs(delta) < CONVERGENCE_THRESHOLD) {
      break;
    }
  }

  return currentTheta;
}
