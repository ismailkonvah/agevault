import { initializeFheInstance, getFheInstance } from '../core/fhevm';
import { createEncryptedPayload, FhevmType } from '../core/encryption';
import { generateReencryptionKey, decryptValue } from '../core/decryption';
import { createFheContract } from '../core/contracts';

/**
 * Node.js specific FHEVM helper class.
 */
export class FhevmNode {
    private isInitialized = false;

    /**
     * Initializes the FHEVM instance for Node.js.
     * @param config FHEVM configuration
     */
    async initialize(config: any) {
        await initializeFheInstance(config);
        this.isInitialized = true;
    }

    /**
     * Encrypts a value.
     */
    async encrypt(
        contractAddress: string,
        userAddress: string,
        value: any,
        type: FhevmType
    ) {
        if (!this.isInitialized) throw new Error('FHEVM Node not initialized');
        return await createEncryptedPayload(contractAddress, userAddress, value, type);
    }

    /**
     * Decrypts a handle.
     */
    async decrypt(
        handle: Uint8Array,
        contractAddress: string,
        userAddress: string,
        signer: any
    ) {
        if (!this.isInitialized) throw new Error('FHEVM Node not initialized');
        const key = await generateReencryptionKey(contractAddress, userAddress, signer);
        return await decryptValue(handle, key);
    }

    /**
     * Creates a contract instance.
     */
    getContract(address: string, abi: any, provider: any) {
        return createFheContract(address, abi, provider);
    }
}
