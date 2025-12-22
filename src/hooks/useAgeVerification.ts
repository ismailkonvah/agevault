import { useState, useCallback } from "react";
import { useFhevm } from "../FhevmProvider";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { useFhevmOperations } from "@fhevm-sdk/adapters/react";
import AgeCheckABI from "../abis/AgeCheck.json";

const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
  console.warn(
    '⚠️ Contract address not set. Please set VITE_CONTRACT_ADDRESS in your .env file.'
  );
}

interface Submission {
  id: string;
  encryptedAge: string;
  timestamp: Date;
  status: "pending" | "verified" | "failed";
}

interface VerificationResult {
  query: string;
  result: boolean;
  timestamp: Date;
}

interface AgeVerificationState {
  submissions: Submission[];
  verifications: VerificationResult[];
  isEncrypting: boolean;
  isVerifying: boolean;
  currentAge: number | null;
}

export function useAgeVerification() {
  const [state, setState] = useState<AgeVerificationState>({
    submissions: [],
    verifications: [],
    isEncrypting: false,
    isVerifying: false,
    currentAge: null,
  });

  const { instance, isReady, error: fhevmError } = useFhevm();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { encrypt, decrypt, isBusy: sdkBusy, message: sdkMessage } = useFhevmOperations();

  const { data: hasAge, refetch: refetchHasAge } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AgeCheckABI,
    functionName: "hasEncryptedAge",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
    },
  });

  const submitAge = useCallback(async (age: number): Promise<string> => {
    if (!instance || !isReady || !address) {
      const errorMsg = fhevmError
        ? `FHEVM initialization failed: ${fhevmError}`
        : !instance
          ? "FHEVM instance not initialized"
          : !isReady
            ? "FHEVM instance not ready"
            : "Wallet not connected";
      console.error(errorMsg);
      return "";
    }

    setState((prev) => ({ ...prev, isEncrypting: true, currentAge: age }));

    try {
      console.log("Starting encryption for age via SDK...");

      // Use the SDK's encrypt operation
      const encryptedInput = await encrypt(CONTRACT_ADDRESS, address, age, 'euint8');

      console.log("✅ Encryption successful via SDK", {
        handlesCount: encryptedInput.handles?.length || 0,
        hasProof: !!encryptedInput.inputProof
      });

      const encryptedAgeHandle = encryptedInput.handles[0];
      const inputProof = encryptedInput.inputProof;

      // Convert handle to hex string for display
      const encryptedAgeHex = "0x" + Array.from(encryptedAgeHandle)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      let txHash = "";

      if (CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000") {
        console.log("Submitting to contract...");
        txHash = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: AgeCheckABI,
          functionName: "submitAge",
          args: [encryptedAgeHandle, inputProof],
        });
        console.log("Transaction sent:", txHash);
      } else {
        console.log("Contract address not set. Simulating submission.");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        txHash = "0x" + crypto.randomUUID().replace(/-/g, '');
      }

      const submission: Submission = {
        id: txHash || crypto.randomUUID(),
        encryptedAge: encryptedAgeHex,
        timestamp: new Date(),
        status: "verified",
      };

      setState((prev) => ({
        ...prev,
        submissions: [submission, ...prev.submissions],
        isEncrypting: false,
      }));

      return encryptedAgeHex;
    } catch (e: any) {
      console.error("Encryption/Submission failed:", e);
      const errorMessage = e?.message || 'Unknown error during encryption/submission';
      setState((prev) => ({ ...prev, isEncrypting: false }));
      throw new Error(errorMessage);
    }
  }, [instance, isReady, address, writeContractAsync, fhevmError, encrypt]);

  const verifyAge = useCallback(
    async (userAddress: string, threshold: number): Promise<boolean | null> => {
      if (!instance || !isReady || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        console.error("FHEVM instance not ready or contract not configured");
        return null;
      }

      setState((prev) => ({ ...prev, isVerifying: true }));

      try {
        console.log(`Verifying age for ${userAddress} against threshold ${threshold}`);

        // Call the contract's verifyAge function
        // Note: This function returns an ebool (encrypted boolean) but since FHE operations
        // are state-modifying, we need to call it as a transaction.
        // The actual decryption of the result would need to happen through the relayer
        // or using FHEVM's decryption methods with proper authorization.
        const txHash = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: AgeCheckABI,
          functionName: "verifyAge",
          args: [userAddress as `0x${string}`, threshold],
        });

        console.log("Verification transaction sent:", txHash);

        // TODO: Implement proper decryption of the ebool result
        // The contract's verifyAge returns an ebool which needs to be decrypted.
        // In a production scenario, you would:
        // 1. Wait for transaction confirmation
        // 2. Use FHEVM instance to decrypt the result (requires authorization/relayer)
        // 3. Or use a relayer service to handle decryption

        // For now, we'll indicate that verification was initiated
        // The actual boolean result would come from decrypting the ebool
        // This is a limitation that needs to be addressed for full functionality
        const result = null; // Placeholder - actual result requires decryption

        // Note: result is null because we can't decrypt the ebool without additional setup
        // In a real implementation, you would decrypt the ebool here
        if (result !== null) {
          const verification: VerificationResult = {
            query: `Is Over ${threshold}?`,
            result,
            timestamp: new Date(),
          };

          setState((prev) => ({
            ...prev,
            verifications: [verification, ...prev.verifications],
            isVerifying: false,
          }));
        } else {
          // For now, just mark verification as complete
          // The UI should indicate that decryption is needed
          setState((prev) => ({ ...prev, isVerifying: false }));
        }

        return result;
      } catch (e) {
        console.error("Verification failed:", e);
        setState((prev) => ({ ...prev, isVerifying: false }));
        return null;
      }
    },
    [instance, isReady, writeContractAsync]
  );

  // Check if a user has submitted an age (for the Verify page)
  const checkUserHasAge = useCallback(
    async (userAddress: string): Promise<boolean> => {
      if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        return false;
      }

      try {
        // This would typically use useReadContract, but for a callback we'll use a different approach
        // For now, return false as a placeholder
        // In the Verify page, we'll use useReadContract directly
        return false;
      } catch (e) {
        console.error("Failed to check user age:", e);
        return false;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      submissions: [],
      verifications: [],
      isEncrypting: false,
      isVerifying: false,
      currentAge: null,
    });
  }, []);

  return {
    ...state,
    submitAge,
    verifyAge,
    checkUserHasAge,
    reset,
    hasSubmittedAge: state.submissions.length > 0 || (hasAge === true),
    contractAddress: CONTRACT_ADDRESS,
  };
}
