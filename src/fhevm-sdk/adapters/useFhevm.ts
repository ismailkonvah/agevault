/**
 * Wagmi-like hook for FHEVM instance
 */

import { useFhevmContext } from './FhevmProvider.js';

export function useFhevm() {
  return useFhevmContext();
}
