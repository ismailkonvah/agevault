import { useState } from "react";
import { Shield, Send, History, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlowCard } from "@/components/GlowCard";
import { WalletButton } from "@/components/WalletButton";
import { EncryptionAnimation } from "@/components/EncryptionAnimation";
import { useWallet } from "@/hooks/useWallet";
import { useAgeVerification } from "@/hooks/useAgeVerification";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const wallet = useWallet();
  const verification = useAgeVerification();
  const { toast } = useToast();
  const [ageInput, setAgeInput] = useState("");

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

    await verification.submitAge(age);
    toast({
      title: "Age encrypted successfully!",
      description: "Your encrypted age has been stored on-chain.",
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Dashboard</h1>
            <p className="text-muted-foreground">
              Submit your encrypted age for private verification.
            </p>
          </div>
          <WalletButton
            isConnected={wallet.isConnected}
            isConnecting={wallet.isConnecting}
            address={wallet.address}
            truncatedAddress={wallet.truncatedAddress}
            onConnect={wallet.connect}
            onDisconnect={wallet.disconnect}
          />
        </div>

        {/* Not connected state */}
        {!wallet.isConnected && (
          <GlowCard className="text-center py-12">
            <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              To submit your encrypted age, please connect your wallet first.
            </p>
            <Button
              onClick={wallet.connect}
              disabled={wallet.isConnecting}
              className={cn(
                "dark:bg-gradient-to-r dark:from-neon-purple dark:to-neon-cyan",
                "dark:hover:shadow-[0_0_20px_hsl(var(--neon-purple)/0.5)]"
              )}
            >
              Connect Wallet
            </Button>
          </GlowCard>
        )}

        {/* Connected state */}
        {wallet.isConnected && (
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
                        placeholder="Enter your age"
                        value={ageInput}
                        onChange={(e) => setAgeInput(e.target.value)}
                        min={1}
                        max={150}
                        className="max-w-[200px] dark:border-neon-purple/30 dark:focus:border-neon-purple"
                      />
                      <Button
                        onClick={handleSubmitAge}
                        disabled={!ageInput || verification.isEncrypting}
                        className={cn(
                          "gap-2",
                          "dark:bg-gradient-to-r dark:from-neon-purple dark:to-neon-cyan",
                          "dark:hover:shadow-[0_0_20px_hsl(var(--neon-purple)/0.5)]"
                        )}
                      >
                        <Send className="h-4 w-4" />
                        Encrypt & Submit
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 dark:bg-neon-purple/5 border border-border dark:border-neon-purple/20">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">How it works:</strong> Your age
                      will be encrypted using Fully Homomorphic Encryption (FHE). The
                      encrypted value can be used for verification without ever revealing
                      your actual age.
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
                  <CheckCircle className="h-5 w-5 text-success dark:text-neon-green" />
                  <h2 className="text-xl font-semibold">Verification Status</h2>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 dark:bg-neon-green/10 border border-success/20 dark:border-neon-green/30">
                  <div className="h-3 w-3 rounded-full bg-success dark:bg-neon-green animate-pulse" />
                  <div>
                    <p className="font-medium text-success dark:text-neon-green">
                      Encrypted Age Stored
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your encrypted age is ready for verification queries.
                    </p>
                  </div>
                </div>
              </GlowCard>
            )}

            {/* Activity Log */}
            <GlowCard glowColor="cyan">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-primary dark:text-neon-cyan" />
                <h2 className="text-xl font-semibold">Activity Log</h2>
              </div>

              {verification.submissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No submissions yet. Submit your encrypted age above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {verification.submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 dark:bg-card/50 border border-border dark:border-neon-cyan/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-success dark:bg-neon-green" />
                        <div>
                          <p className="text-sm font-medium">Age Encrypted & Stored</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {submission.encryptedAge.slice(0, 30)}...
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
