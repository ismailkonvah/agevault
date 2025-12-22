import { useState, useEffect, useCallback } from 'react';
import { initializeFheInstance, getFheInstance } from '../core/fhevm';
import { createEncryptedPayload, createEncryptedInput, FhevmType } from '../core/encryption';
import { generateReencryptionKey, decryptValue } from '../core/decryption';
import { createFheContract } from '../core/contracts';
import { FhevmInstance } from 'fhevmjs';

/**
 * Hook to manage FHEVM instance lifecycle in React.
 */
export function useFhevm(config?: any) {
    const [instance, setInstance] = useState<FhevmInstance | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initialize = useCallback(async (customConfig?: any) => {
        try {
            const inst = await initializeFheInstance(customConfig || config);
            setInstance(inst);
            setIsInitialized(true);
            return inst;
        } catch (err: any) {
            setError(err.message || 'Failed to initialize FHEVM');
            throw err;
        }
    }, [config]);

    useEffect(() => {
        if (config && !isInitialized) {
            initialize();
        }
    }, [config, isInitialized, initialize]);

    return { instance, isInitialized, initialize, error };
}

/**
 * Hook for FHEVM operations like encryption and decryption.
 */
export function useFhevmOperations() {
    const [isBusy, setIsBusy] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const encrypt = useCallback(async (
        contractAddress: string,
        userAddress: string,
        value: any,
        type: FhevmType
    ) => {
        setIsBusy(true);
        setMessage('Encrypting value...');
        try {
            const payload = await createEncryptedPayload(contractAddress, userAddress, value, type);
            return payload;
        } finally {
            setIsBusy(false);
            setMessage(null);
        }
    }, []);

    const decrypt = useCallback(async (
        handle: Uint8Array,
        contractAddress: string,
        userAddress: string,
        signer: any
    ) => {
        setIsBusy(true);
        setMessage('Generating decryption signature...');
        try {
            const key = await generateReencryptionKey(contractAddress, userAddress, signer);
            setMessage('Decrypting...');
            const result = await decryptValue(handle, key);
            return result;
        } finally {
            setIsBusy(false);
            setMessage(null);
        }
    }, []);

    return { encrypt, decrypt, isBusy, message };
}

/**
 * Hook to use an FHEVM-enabled contract.
 */
export function useContract(address: string, abi: any, signerOrProvider: any) {
    const [contract, setContract] = useState<any>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (address && abi && signerOrProvider) {
            const instance = createFheContract(address, abi, signerOrProvider);
            setContract(instance);
            setIsReady(true);
        }
    }, [address, abi, signerOrProvider]);

    return { contract, isReady };
}
