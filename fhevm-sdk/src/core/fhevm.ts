import { createInstance, FhevmInstance } from '@zama-fhe/relayer-sdk/web';

export interface FhevmConfig {
    chainId: number;
    publicKey: string;
    gatewayUrl: string;
    networkUrl: string;
}

let fheInstance: FhevmInstance | null = null;

// Define global interface for the CDN SDK
interface Window {
    RelayerSDK?: any;
    relayerSDK?: any;
    ethereum?: any;
}

/**
 * Initializes the FHEVM instance with the provided configuration.
 * Preference: Global CDN SDK (avoids WASM bundling issues) > npm package
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

        // CHECK FOR GLOBAL SDK (TEMPLATE METHOD)
        const globalSdk = (window as any).RelayerSDK || (window as any).relayerSDK;
        if (globalSdk) {
            console.log('✅ FHEVM: Found global RelayerSDK (CDN). initializing...');
            // FIX: Initialize with local WASM paths to avoid CDN fetch
            await globalSdk.initSDK({
                tfhe: { wasm: '/tfhe_bg.wasm' },
                kmsVerifier: { wasm: '/kms_lib_bg.wasm' }
            });
            // Important: Global SDK creates instance differently, but for compatibility we use our standard config
            // Note: The template merges config with window.ethereum manually.
            const cdnConfig = { ...config, network: (window as any).ethereum };
            fheInstance = await globalSdk.createInstance(cdnConfig);
            console.log('✅ FHEVM: Instance created via CDN SDK');
            return fheInstance!;
        }

        console.log('FHEVM: Global SDK not found, falling back to bundled npm package...');
        fheInstance = await createInstance(config);
        console.log('FHEVM: Instance created successfully (bundled)');
        return fheInstance!;
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
