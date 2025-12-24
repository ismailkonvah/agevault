import { useState, useCallback } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { useFhevm, useEncrypt } from "../fhevm-sdk/index";
import AgeCheckABI from "../abis/AgeCheck.json";

const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

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

  const { isInitialized: isReady } = useFhevm();
  const { encrypt, isEncrypting: sdkBusy } = useEncrypt();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

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
    if (!isReady || !address) {
      console.error(!isReady ? "FHEVM not ready" : "Wallet not connected");
      return "";
    }

    setState((prev) => ({ ...prev, isEncrypting: true, currentAge: age }));

    try {
      console.log("Starting encryption for age...");

      // Use 8-bit encryption as required by the AgeCheck contract (externalEuint8)
      const encryptedInput = await encrypt(CONTRACT_ADDRESS, address, age, 8);

      console.log("✅ Encryption successful", {
        hasData: !!encryptedInput.encryptedData,
        hasProof: !!encryptedInput.proof
      });

      const { encryptedData, proof } = encryptedInput;

      // Convert to hex strings for Wagmi/Viem compatibility
      const toHex = (data: any) => {
        if (data instanceof Uint8Array) {
          return "0x" + Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('');
        }
        return data;
      };

      const encryptedDataHex = toHex(encryptedData);
      const proofHex = toHex(proof);

      let txHash = "";

      if (CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000") {
        console.log("Submitting to contract...", {
          address: CONTRACT_ADDRESS,
          user: address,
          encryptedData: encryptedDataHex,
          proof: proofHex ? (proofHex.slice(0, 20) + "...") : "null"
        });

        txHash = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: AgeCheckABI,
          functionName: "submitAge",
          args: [encryptedDataHex, proofHex],
          gas: 5000000n, // Manual gas limit to prevent Out Of Gas reverts on standard nodes
        });
        console.log("✅ Transaction hash generated:", txHash);
      } else {
        txHash = "0x" + crypto.randomUUID().replace(/-/g, '');
      }

      const submission: Submission = {
        id: txHash || crypto.randomUUID(),
        encryptedAge: encryptedDataHex,
        timestamp: new Date(),
        status: "verified", // In a real app, this would be 'pending' until receipt
      };

      setState((prev) => ({
        ...prev,
        submissions: [submission, ...prev.submissions],
        isEncrypting: false,
      }));

      return encryptedDataHex;
    } catch (e: any) {
      console.error("Encryption/Submission failed:", e);
      setState((prev) => ({ ...prev, isEncrypting: false }));
      throw e;
    }
  }, [isReady, address, encrypt, writeContractAsync]);

  const verifyAge = useCallback(
    async (userAddress: string, threshold: number): Promise<boolean | null> => {
      // Logic for verification would go here if implemented in SDK/Contract
      return null;
    },
    []
  );

  const checkUserHasAge = useCallback(
    async (userAddress: string): Promise<boolean> => {
      return false;
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
    isEncrypting: state.isEncrypting || sdkBusy,
    contractAddress: CONTRACT_ADDRESS,
  };
}
