import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { SepoliaConfig, FhevmInstance } from '@zama-fhe/relayer-sdk/web';
import { initializeFheInstance } from '@fhevm-sdk/core/fhevm';

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
                console.log("Initializing FHEVM via SDK...");

                const networkUrl = import.meta.env.VITE_SEPOLIA_RPC_URL;

                if (!networkUrl) {
                    const errMsg = "VITE_SEPOLIA_RPC_URL is not set in environment variables";
                    console.error(errMsg);
                    setError(errMsg);
                    return;
                }

                // Corrected Sepolia config for current Zama testnet
                const zamaConfig = {
                    ...SepoliaConfig,
                    gatewayUrl: "https://relayer.testnet.zama.cloud",
                    networkUrl: networkUrl,
                };

                console.log("FHEVM: Using configuration:", zamaConfig);

                // Initialize FHEVM instance using the SDK's initializeFheInstance
                const inst = await initializeFheInstance(zamaConfig);

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
