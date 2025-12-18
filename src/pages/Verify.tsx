import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Shield, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlowCard } from "@/components/GlowCard";
import { useAgeVerification } from "@/hooks/useAgeVerification";
import { useReadContract } from "wagmi";
import AgeCheckABI from "@/abis/AgeCheck.json";
import { cn } from "@/lib/utils";

const verificationOptions = [
  { threshold: 18, label: "Is Over 18?", description: "Legal adult verification" },
  { threshold: 21, label: "Is Over 21?", description: "US alcohol/gambling age" },
  { threshold: 65, label: "Is Over 65?", description: "Senior citizen verification" },
];

export default function Verify() {
  const verification = useAgeVerification();
  const [walletAddress, setWalletAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundUser, setFoundUser] = useState(false);
  const [verificationResults, setVerificationResults] = useState<
    Record<number, boolean | null>
  >({});
  const [verifyingThreshold, setVerifyingThreshold] = useState<number | null>(null);

  // Check if the searched user has submitted an age
  const { data: userHasAge, refetch: checkUserAge, isLoading: checkingAge } = useReadContract({
    address: verification.contractAddress,
    abi: AgeCheckABI,
    functionName: "hasEncryptedAge",
    args: walletAddress && walletAddress.startsWith("0x") && walletAddress.length === 42 
      ? [walletAddress as `0x${string}`] 
      : undefined,
    query: {
      enabled: false, // We'll trigger this manually
    },
  });

  const handleSearch = async () => {
    if (!walletAddress) return;
    
    // Validate address format
    if (!walletAddress.startsWith("0x") || walletAddress.length !== 42) {
      setFoundUser(false);
      return;
    }

    setIsSearching(true);
    setVerificationResults({});
    setFoundUser(false);

    try {
      // Check if user has submitted an age on-chain
      const result = await checkUserAge();
      const hasAge = result.data as boolean;
      setFoundUser(hasAge === true);
    } catch (e) {
      console.error("Failed to check user age:", e);
      setFoundUser(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVerify = async (threshold: number) => {
    if (!walletAddress || !foundUser) return;
    
    setVerifyingThreshold(threshold);
    setVerificationResults((prev) => ({ ...prev, [threshold]: null }));
    
    try {
      const result = await verification.verifyAge(walletAddress, threshold);
      setVerificationResults((prev) => ({ ...prev, [threshold]: result }));
    } catch (e) {
      console.error("Verification failed:", e);
      setVerificationResults((prev) => ({ ...prev, [threshold]: false }));
    } finally {
      setVerifyingThreshold(null);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Verification Portal</h1>
          <p className="text-muted-foreground">
            Verify age conditions without revealing the actual age.
          </p>
        </div>

        {/* Search Card */}
        <GlowCard glowColor="purple" className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-primary dark:text-neon-purple" />
            <h2 className="text-xl font-semibold">Lookup User</h2>
          </div>

          <div className="flex gap-3">
            <Input
              placeholder="Enter wallet address (0x...)"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="font-mono dark:border-neon-purple/30 dark:focus:border-neon-purple"
            />
            <Button
              onClick={handleSearch}
              disabled={!walletAddress || isSearching}
              className={cn(
                "gap-2 min-w-[120px]",
                "dark:bg-gradient-to-r dark:from-neon-purple dark:to-neon-cyan",
                "dark:hover:shadow-[0_0_20px_hsl(var(--neon-purple)/0.5)]"
              )}
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Enter a wallet address to check if they have submitted an encrypted age.
          </p>
        </GlowCard>

        {/* User Found */}
        {foundUser && (
          <>
            {/* User Info */}
            <GlowCard glowColor="green" className="mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-success/10 dark:bg-neon-green/20 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success dark:text-neon-green" />
                </div>
                <div>
                  <p className="font-semibold">User Found</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {walletAddress.slice(0, 10)}...{walletAddress.slice(-6)}
                  </p>
                </div>
              </div>
            </GlowCard>

            {/* Verification Options */}
            <GlowCard glowColor="cyan" className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary dark:text-neon-cyan" />
                <h2 className="text-xl font-semibold">Run Verification</h2>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Each verification compares the encrypted age against a threshold using
                homomorphic operations. The actual age is{" "}
                <strong className="text-foreground">never revealed</strong>.
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                {verificationOptions.map((option) => {
                  const result = verificationResults[option.threshold];
                  const isVerifying = verifyingThreshold === option.threshold;

                  return (
                    <div
                      key={option.threshold}
                      className={cn(
                        "p-4 rounded-lg border transition-all",
                        result === true &&
                          "bg-success/10 border-success/30 dark:bg-neon-green/10 dark:border-neon-green/30",
                        result === false &&
                          "bg-destructive/10 border-destructive/30",
                        result === null || result === undefined
                          ? "bg-muted/50 border-border dark:border-neon-cyan/20"
                          : ""
                      )}
                    >
                      <h3 className="font-semibold mb-1">{option.label}</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        {option.description}
                      </p>

                      {result === null || result === undefined ? (
                        <Button
                          onClick={() => handleVerify(option.threshold)}
                          disabled={isVerifying}
                          variant="outline"
                          className="w-full gap-2 dark:border-neon-cyan/50 dark:hover:bg-neon-cyan/10"
                        >
                          {isVerifying ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4" />
                              Verify
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center gap-2 py-2">
                          {result ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-success dark:text-neon-green" />
                              <span className="font-semibold text-success dark:text-neon-green">
                                TRUE
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5 text-destructive" />
                              <span className="font-semibold text-destructive">
                                FALSE
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </GlowCard>

            {/* Privacy Notice */}
            <GlowCard className="border-primary/20 dark:border-neon-purple/30">
              <div className="flex gap-3">
                <Lock className="h-5 w-5 text-primary dark:text-neon-purple flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Privacy Guaranteed</h3>
                  <p className="text-sm text-muted-foreground">
                    All verifications are performed using Fully Homomorphic Encryption.
                    The encrypted age value is compared against thresholds without ever
                    being decrypted. You only see TRUE or FALSE — never the actual age.
                  </p>
                </div>
              </div>
            </GlowCard>
          </>
        )}

        {/* No user found */}
        {!foundUser && walletAddress && !isSearching && (
          <GlowCard className="text-center py-8">
            <XCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-1">No User Found</h3>
            <p className="text-sm text-muted-foreground">
              No encrypted age data found for this address.
            </p>
          </GlowCard>
        )}
      </div>
    </div>
  );
}
