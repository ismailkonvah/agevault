import { Contract, Interface, JsonRpcProvider, Signer } from 'ethers';

/**
 * Creates a contract instance for FHEVM interactions.
 * @param address The contract address
 * @param abi The contract ABI
 * @param providerOrSigner The ethers provider or signer
 */
export function createFheContract(
    address: string,
    abi: any,
    providerOrSigner: Signer | JsonRpcProvider
) {
    return new Contract(address, abi, providerOrSigner);
}

/**
 * Returns an Interface for the provided ABI.
 */
export function getContractInterface(abi: any) {
    return new Interface(abi);
}
