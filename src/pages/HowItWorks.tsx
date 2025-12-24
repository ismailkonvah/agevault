import { Shield, Lock, Eye, Code, ExternalLink, Cpu, Database, CheckCircle } from "lucide-react";
import { GlowCard } from "@/components/GlowCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fheSteps = [
  {
    icon: Lock,
    title: "Client-Side Encryption",
    description:
      "Your age is encrypted in your browser using the Zama FHEVM library before any data leaves your device.",
  },
  {
    icon: Database,
    title: "On-Chain Storage",
    description:
      "The encrypted value (ciphertext) is stored on the blockchain. It looks like random data to everyone.",
  },
  {
    icon: Cpu,
    title: "Homomorphic Computation",
    description:
      "Smart contracts perform mathematical operations on encrypted data without decrypting it.",
  },
  {
    icon: CheckCircle,
    title: "Encrypted Result",
    description:
      "The comparison result (also encrypted) is decrypted only by authorized parties to reveal TRUE or FALSE.",
  },
];

const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract PrivateAgeVerification {
    // Encrypted age storage per user
    mapping(address => euint8) internal encryptedAges;
    
    // Store encrypted age (user calls this)
    function submitAge(externalEuint8 encryptedAge, bytes calldata inputProof) public {
        encryptedAges[msg.sender] = FHE.fromExternal(encryptedAge, inputProof);
    }
    
    // Verify if user is over a threshold (verifier calls this)
    function verifyAge(address user, uint8 threshold) public returns (ebool) {
        euint8 userAge = encryptedAges[user];
        euint8 encryptedThreshold = FHE.asEuint8(threshold);
        
        // Compare encrypted values - returns encrypted boolean
        return FHE.ge(userAge, encryptedThreshold);
    }
}`;

export default function HowItWorks() {
  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 dark:bg-neon-purple/20 dark:text-neon-purple">
            <Shield className="h-4 w-4" />
            Technical Deep Dive
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            How FHE Age Verification Works
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Understanding the cryptography behind private age verification using
            Fully Homomorphic Encryption.
          </p>
        </div>

        {/* What is FHE */}
        <GlowCard glowColor="purple" className="mb-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-neon-purple/20 flex items-center justify-center flex-shrink-0">
              <Lock className="h-6 w-6 text-primary dark:text-neon-purple" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">
                What is Fully Homomorphic Encryption?
              </h2>
              <p className="text-muted-foreground mb-4">
                FHE is a form of encryption that allows computations to be performed
                directly on encrypted data without decrypting it first. The result,
                when decrypted, matches what you'd get if you performed the same
                operations on the unencrypted data.
              </p>
              <div className="p-4 rounded-lg bg-muted/50 dark:bg-neon-purple/5 border border-border dark:border-neon-purple/20 font-mono text-sm">
                <p className="text-muted-foreground">
                  <span className="text-primary dark:text-neon-purple">encrypt(25)</span>
                  {" → "}
                  <span className="text-neon-cyan">compute( ≥ 18 )</span>
                  {" → "}
                  <span className="text-success dark:text-neon-green">decrypt() = TRUE</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  The value "25" is never visible during computation!
                </p>
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Flow Steps */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">The Verification Flow</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {fheSteps.map((step, index) => (
              <GlowCard
                key={index}
                glowColor={index % 2 === 0 ? "purple" : "cyan"}
                className="relative"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm dark:bg-neon-purple dark:shadow-[0_0_15px_hsl(var(--neon-purple)/0.5)]">
                  {index + 1}
                </div>
                <div className="flex items-start gap-3 pt-2">
                  <step.icon className="h-5 w-5 text-primary dark:text-neon-cyan flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>

        {/* Smart Contract Code */}
        <GlowCard glowColor="cyan" className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Code className="h-5 w-5 text-primary dark:text-neon-cyan" />
            <h2 className="text-xl font-semibold">Smart Contract Logic</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Here's a simplified example of how the FHE age verification contract works
            using Zama's FHEVM:
          </p>
          <div className="relative">
            <pre
              className={cn(
                "p-4 rounded-lg overflow-x-auto text-sm",
                "bg-muted text-muted-foreground",
                "dark:bg-[#0d1117] dark:text-gray-300",
                "border border-border dark:border-neon-cyan/20"
              )}
            >
              <code>{contractCode}</code>
            </pre>
          </div>
        </GlowCard>

        {/* Security Guarantees */}
        <GlowCard glowColor="green" className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-success dark:text-neon-green" />
            <h2 className="text-xl font-semibold">Security Guarantees</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Zero Knowledge of Raw Data</h3>
                <p className="text-sm text-muted-foreground">
                  Verifiers never see your actual age, only TRUE/FALSE results.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">End-to-End Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  Data is encrypted before leaving your device and stays encrypted on-chain.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Cpu className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Mathematically Proven</h3>
                <p className="text-sm text-muted-foreground">
                  FHE encryption provides 128-bit security with formal proofs.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">On-Chain Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  All operations are verifiable on the blockchain.
                </p>
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Zama FHEVM */}
        <GlowCard className="text-center">
          <h2 className="text-xl font-semibold mb-2">Powered by Zama FHEVM</h2>
          <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
            This demo showcases concepts from Zama's FHEVM - the first confidential
            smart contract protocol using Fully Homomorphic Encryption.
          </p>
          <Button
            variant="outline"
            className="gap-2 dark:border-neon-purple/50 dark:hover:bg-neon-purple/10"
            onClick={() => window.open("https://docs.zama.ai/fhevm", "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            Learn More About FHEVM
          </Button>
        </GlowCard>
      </div>
    </div>
  );
}
