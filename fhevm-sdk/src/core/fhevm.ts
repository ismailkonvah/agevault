import { createInstance, FhevmInstance } from '@zama-fhe/relayer-sdk/web';

export interface FhevmConfig {
    chainId: number;
    publicKey: string;
    gatewayUrl: string;
    networkUrl: string;
}

let fheInstance: FhevmInstance | null = null;

/**
 * Initializes the FHEVM instance with the provided configuration.
 * @param config The FHEVM configuration (publicKey, chainId, etc.)
 * @returns The initialized FHEVM instance
 */
export async function initializeFheInstance(config: any): Promise<FhevmInstance> {
    if (fheInstance) return fheInstance;

    try {
        fheInstance = await createInstance(config);
        return fheInstance;
    } catch (error) {
        console.error('Failed to initialize FHEVM instance:', error);
        throw error;
    }
}

/**
 * Gets the current FHEVM instance.
 * Throws an error if the instance has not been initialized.
 */
export function getFheInstance(): FhevmInstance {
    if (!fheInstance) {
        throw new Error('FHEVM instance not initialized. Call initializeFheInstance first.');
    }
    return fheInstance;
}

/**
 * Resets the FHEVM instance (useful for testing or network changes).
 */
export function resetFheInstance(): void {
    fheInstance = null;
}
