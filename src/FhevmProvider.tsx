import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { createInstance, FhevmInstance } from 'fhevmjs';

interface FhevmContextType {
    instance: FhevmInstance | null;
    isReady: boolean;
    error: string | null;
}

const FhevmContext = createContext<FhevmContextType>({
    instance: null,
    isReady: false,
    error: null
});

export const useFhevm = () => useContext(FhevmContext);

export const FhevmProvider = ({ children }: { children: ReactNode }) => {
    const [instance, setInstance] = useState<FhevmInstance | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                console.log("Initializing FHEVM...");

                const networkUrl = import.meta.env.VITE_SEPOLIA_RPC_URL;

                if (!networkUrl) {
                    const errMsg = "VITE_SEPOLIA_RPC_URL is not set in environment variables";
                    console.error(errMsg);
                    setError(errMsg);
                    return;
                }

                // Contract addresses from official Zama documentation for Sepolia
                // See: https://docs.zama.org/protocol/solidity-guides/smart-contract/configure/contract_addresses
                const aclContractAddress = '0xf0Ffdc93b7E186bC2f8CB3dAA75D86d1930A433D';
                const kmsContractAddress = '0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A';

                // Gateway URL - fhevmjs uses the gateway endpoint to fetch the public key
                // Note: As of late 2024/2025, Zama has moved to the .org domain
                const gatewayUrl = import.meta.env.VITE_ZAMA_GATEWAY_URL || 'https://relayer.testnet.zama.org';

                console.log("FHEVM Config:", {
                    chainId: 11155111,
                    networkUrl,
                    gatewayUrl,
                    kmsContractAddress,
                    aclContractAddress
                });

                // Initialize FHEVM instance for Sepolia (Chain ID 11155111)
                // The gatewayUrl is used to fetch the FHE public key
                const inst = await createInstance({
                    chainId: 11155111,
                    networkUrl,
                    gatewayUrl,
                    kmsContractAddress,
                    aclContractAddress,
                });

                console.log("FHEVM Initialized successfully", inst);
                setInstance(inst);
                setIsReady(true);
                setError(null);
            } catch (e: any) {
                const errorMessage = e?.message || 'Unknown error during FHEVM initialization';
                console.error("Failed to initialize FHEVM:", e);
                console.error("Error details:", {
                    message: errorMessage,
                    stack: e?.stack,
                    cause: e?.cause
                });

                setError(errorMessage);
                setIsReady(false);
                setInstance(null);

                // Provide helpful error messages
                if (errorMessage.includes('relayer') || errorMessage.includes('gateway') || errorMessage.includes('public key')) {
                    console.error("💡 Tip: Check that the gateway URL is correct and accessible");
                    console.error("   Current gateway URL: https://relayer.testnet.zama.org");
                }
                if (errorMessage.includes('network') || errorMessage.includes('RPC')) {
                    console.error("💡 Tip: Verify your RPC URL is correct and you have network access");
                }
            }
        };

        init();
    }, []);

    return (
        <FhevmContext.Provider value={{ instance, isReady, error }}>
            {children}
        </FhevmContext.Provider>
    );
};
