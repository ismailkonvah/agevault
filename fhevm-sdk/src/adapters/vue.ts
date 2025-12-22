import { ref, onMounted, useCallback } from 'vue';
import { initializeFheInstance } from '../core/fhevm';
import { createEncryptedPayload, FhevmType } from '../core/encryption';
import { generateReencryptionKey, decryptValue } from '../core/decryption';
import { createFheContract } from '../core/contracts';

/**
 * Vue composable to manage FHEVM instance.
 */
export function useFhevmVue(config?: any) {
    const instance = ref<any>(null);
    const isInitialized = ref(false);
    const error = ref<string | null>(null);

    const initialize = async (customConfig?: any) => {
        try {
            const inst = await initializeFheInstance(customConfig || config);
            instance.value = inst;
            isInitialized.value = true;
            return inst;
        } catch (err: any) {
            error.value = err.message || 'Failed to initialize FHEVM';
            throw err;
        }
    };

    onMounted(() => {
        if (config) {
            initialize();
        }
    });

    return { instance, isInitialized, initialize, error };
}

/**
 * Vue composable for FHEVM operations.
 */
export function useFhevmOperationsVue() {
    const isBusy = ref(false);
    const message = ref<string | null>(null);

    const encrypt = async (
        contractAddress: string,
        userAddress: string,
        value: any,
        type: FhevmType
    ) => {
        isBusy.value = true;
        message.value = 'Encrypting value...';
        try {
            return await createEncryptedPayload(contractAddress, userAddress, value, type);
        } finally {
            isBusy.value = false;
            message.value = null;
        }
    };

    const decrypt = async (
        handle: Uint8Array,
        contractAddress: string,
        userAddress: string,
        signer: any
    ) => {
        isBusy.value = true;
        message.value = 'Generating decryption signature...';
        try {
            const key = await generateReencryptionKey(contractAddress, userAddress, signer);
            message.value = 'Decrypting...';
            return await decryptValue(handle, key);
        } finally {
            isBusy.value = false;
            message.value = null;
        }
    };

    return { encrypt, decrypt, isBusy, message };
}

/**
 * Vue composable for contract interaction.
 */
export function useContractVue(address: string, abi: any, signerOrProvider: any) {
    const contract = ref<any>(null);
    const isReady = ref(false);

    onMounted(() => {
        if (address && abi && signerOrProvider) {
            contract.value = createFheContract(address, abi, signerOrProvider);
            isReady.value = true;
        }
    });

    return { contract, isReady };
}
