import { useState, useEffect } from "react";
import { Shield, Send, History, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlowCard } from "@/components/GlowCard";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { EncryptionAnimation } from "@/components/EncryptionAnimation";
import { useAgeVerification } from "@/hooks/useAgeVerification";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from 'wagmi';
import { useFhevm } from "@/fhevm-sdk/index";

export default function Dashboard() {
  const { isConnected, address } = useAccount();
  const { status: fhevmStatus, initialize: initializeFhevm, error: fhevmError } = useFhevm();
  const verification = useAgeVerification();
  const { toast } = useToast();
  const [ageInput, setAgeInput] = useState("");

  // Auto-initialize FHEVM when wallet connects
  useEffect(() => {
    if (isConnected && fhevmStatus === 'idle') {
      initializeFhevm();
    }
  }, [isConnected, fhevmStatus, initializeFhevm]);

  const handleSubmitAge = async () => {
    const age = parseInt(ageInput);
    if (isNaN(age) || age < 1 || age > 150) {
      toast({
        title: "Invalid age",
        description: "Please enter a valid age between 1 and 150.",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (fhevmStatus !== 'ready') {
      toast({
        title: "FHEVM not ready",
        description: "Please wait for FHEVM to initialize.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await verification.submitAge(age);
      if (result) {
        toast({
          title: "Age submitted successfully!",
          description: "Your age has been encrypted and stored on-chain.",
        });
        setAgeInput("");
      }
    } catch (error: any) {
      console.error("Error submitting age:", error);
      toast({
        title: "Error",
        description: error?.message || "An error occurred while submitting your age.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Dashboard</h1>
            <p className="text-muted-foreground">
              Submit your age securely using Fully Homomorphic Encryption.
            </p>
          </div>
          <ConnectButton />
        </div>

        {/* FHEVM Status Banner */}
        {isConnected && (
          <div className="mb-6">
            {fhevmStatus === 'loading' && (
              <GlowCard className="border-primary/50 bg-primary/5">
                <div className="flex items-center gap-4">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Initializing FHEVM...</h3>
                    <p className="text-sm text-muted-foreground">
                      Setting up the encryption environment.
                    </p>
                  </div>
                </div>
              </GlowCard>
            )}
            {fhevmStatus === 'error' && (
              <GlowCard className="border-destructive/50 bg-destructive/5">
                <div className="flex items-center gap-4">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                  <div>
                    <h3 className="font-semibold text-destructive mb-1">FHEVM Error</h3>
                    <p className="text-sm text-muted-foreground">
                      {fhevmError || "Failed to initialize FHEVM."}
                    </p>
                  </div>
                </div>
              </GlowCard>
            )}
            {fhevmStatus === 'ready' && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-xs font-medium border border-success/20 w-fit">
                <CheckCircle className="h-3 w-3" />
                FHEVM System Secure
              </div>
            )}
          </div>
        )}

        {/* Not connected state */}
        {!isConnected && (
          <GlowCard className="text-center py-12">
            <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              To submit your encrypted age, please connect your wallet first.
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </GlowCard>
        )}

        {/* Connected state */}
        {isConnected && (
          <div className="space-y-6">
            {/* Submit Age Card */}
            <GlowCard glowColor="purple">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary dark:text-neon-purple" />
                <h2 className="text-xl font-semibold">Submit Encrypted Age</h2>
              </div>

              {!verification.isEncrypting ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="age" className="text-sm font-medium">
                      Your Age
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      This will be encrypted before leaving your browser.
                    </p>
                    <div className="flex gap-3">
                      <Input
                        id="age"
                        type="number"
                        placeholder="18"
                        value={ageInput}
                        onChange={(e) => setAgeInput(e.target.value)}
                        min={1}
                        max={150}
                        className="max-w-[200px]"
                        disabled={fhevmStatus !== 'ready'}
                      />
                      <Button
                        onClick={handleSubmitAge}
                        disabled={!ageInput || verification.isEncrypting || fhevmStatus !== 'ready'}
                        className={cn(
                          "gap-2",
                          "dark:bg-gradient-to-r dark:from-neon-purple dark:to-neon-cyan"
                        )}
                      >
                        <Send className="h-4 w-4" />
                        Encrypt & Submit
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Security Note:</strong> Only you and authorized verifiers can ever see your actual age.
                    </p>
                  </div>
                </div>
              ) : (
                <EncryptionAnimation
                  isActive={verification.isEncrypting}
                  inputValue={ageInput}
                />
              )}
            </GlowCard>

            {/* Status Card */}
            {verification.hasSubmittedAge && (
              <GlowCard glowColor="green">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <h2 className="text-xl font-semibold">Verification Status</h2>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
                  <div>
                    <p className="font-medium text-success">
                      Encrypted Age Submitted
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your data is stored and secured on-chain.
                    </p>
                  </div>
                </div>
              </GlowCard>
            )}

            {/* Activity Log */}
            <GlowCard glowColor="cyan">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Activity Log</h2>
              </div>

              {verification.submissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No transactions yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {verification.submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-success" />
                        <div>
                          <p className="text-sm font-medium">Age Encrypted & Sent</p>
                          <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                            {submission.encryptedAge}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {submission.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </GlowCard>
          </div>
        )}
      </div>
    </div>
  );
}
