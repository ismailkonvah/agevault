import { getFheInstance } from './fhevm';

export type FhevmType = 'ebool' | 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'euint128' | 'euint256' | 'eaddress';

/**
 * Creates an encrypted input for a contract interaction.
 * @param contractAddress The address of the target contract
 * @param userAddress The address of the user (signer)
 */
export function createEncryptedInput(contractAddress: string, userAddress: string) {
    const instance = getFheInstance();
    return instance.createEncryptedInput(contractAddress, userAddress);
}

/**
 * Encrypts a value for a specific FHEVM type.
 * @param input The encrypted input instance
 * @param value The value to encrypt
 * @param type The FHEVM type
 */
export function encryptValue(input: any, value: any, type: FhevmType) {
    switch (type) {
        case 'ebool':
            return input.addBool(value);
        case 'euint8':
            return input.add8(value);
        case 'euint16':
            return input.add16(value);
        case 'euint32':
            return input.add32(value);
        case 'euint64':
            return input.add64(value);
        case 'euint128':
            return input.add128(value);
        case 'euint256':
            return input.add256(value);
        case 'eaddress':
            return input.addAddress(value);
        default:
            throw new Error(`Unsupported FHEVM type: ${type}`);
    }
}

/**
 * Convenience helper to create and encrypt an input in one go.
 */
export async function createEncryptedPayload(
    contractAddress: string,
    userAddress: string,
    value: any,
    type: FhevmType
) {
    const input = createEncryptedInput(contractAddress, userAddress);
    encryptValue(input, value, type);
    return await input.encrypt();
}
