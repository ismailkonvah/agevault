import { useState, useCallback } from "react";

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

  const submitAge = useCallback(async (age: number): Promise<string> => {
    setState((prev) => ({ ...prev, isEncrypting: true, currentAge: age }));

    // Simulate encryption delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Generate mock encrypted data
    const encryptedAge = `enc_${Buffer.from(
      JSON.stringify({ v: age, n: Math.random().toString(36).slice(2) })
    ).toString("base64")}`;

    const submission: Submission = {
      id: crypto.randomUUID(),
      encryptedAge,
      timestamp: new Date(),
      status: "verified",
    };

    setState((prev) => ({
      ...prev,
      submissions: [submission, ...prev.submissions],
      isEncrypting: false,
    }));

    return encryptedAge;
  }, []);

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
