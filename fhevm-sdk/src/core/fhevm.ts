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
    if (fheInstance) {
        console.log('FHEVM: Returning existing instance');
        return fheInstance;
    }

    try {
        console.log('FHEVM: Initializing with config:', JSON.stringify({
            ...config,
            publicKey: config.publicKey ? '(present)' : '(missing)'
        }, null, 2));

        fheInstance = await createInstance(config);
        console.log('FHEVM: Instance created successfully');
        return fheInstance;
    } catch (error: any) {
        console.error('FHEVM: Failed to initialize instance:', error);

        // Enhance error message for common issues
        if (error.message?.includes('public key')) {
            console.error('FHEVM TIP: This often means the gatewayUrl/relayerUrl is incorrect or unreachable.');
        }
        if (error.message?.includes('__wbindgen_malloc')) {
            console.error('FHEVM TIP: WebAssembly initialization failed. Check for version conflicts between fhevmjs components.');
        }

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
