import { useState, useCallback } from "react";
import { useFhevm } from "../FhevmProvider";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import AgeCheckABI from "../abis/AgeCheck.json";

// TODO: Replace with deployed contract address on Sepolia
const CONTRACT_ADDRESS = "0xCD81F9901D121E67496026fBE13e0D7f503f87b5";

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

  const { instance, isReady } = useFhevm();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const submitAge = useCallback(async (age: number): Promise<string> => {
    if (!instance || !isReady || !address) {
      console.error("FHEVM instance not ready or wallet not connected");
      return "";
    }

    setState((prev) => ({ ...prev, isEncrypting: true, currentAge: age }));

    try {
      console.log("Starting encryption for age:", age);

      // 1. Create encrypted input for the specific contract and user
      // This binds the encryption to the contract address and user address to prevent replay attacks
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);

      // 2. Add the 8-bit integer value (age)
      input.add8(age);

      // 3. Encrypt - This will trigger the Wallet signature request (EIP-712)
      console.log("Requesting signature...");
      const encryptedInput = await input.encrypt();
      console.log("Encryption successful, generated handles and proof");

      // Extract the handle (ciphertext) and the input proof
      // handles[0] corresponds to the first added value (age)
      const encryptedAgeHandle = encryptedInput.handles[0];
      const inputProof = encryptedInput.inputProof;

      // Convert handle to hex string for display/logging if needed
      const encryptedAgeHex = "0x" + Array.from(encryptedAgeHandle)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      let txHash = "";

      if (CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000") {
        console.log("Submitting to contract...");
        // Call the smart contract with the handle and proof
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
    } catch (e) {
      console.error("Encryption/Submission failed:", e);
      setState((prev) => ({ ...prev, isEncrypting: false }));
      return "";
    }
  }, [instance, isReady, address, writeContractAsync]);

  const verifyAge = useCallback(
    async (threshold: number): Promise<boolean> => {
      setState((prev) => ({ ...prev, isVerifying: true }));

      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const result = state.currentAge !== null && state.currentAge >= threshold;

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

      return result;
    },
    [state.currentAge]
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
    reset,
    hasSubmittedAge: state.submissions.length > 0,
  };
}
