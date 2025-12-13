import { Link } from "react-router-dom";
import { Shield, Lock, Eye, CheckCircle, ArrowRight, Zap, Database, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/GlowCard";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Lock,
    title: "Encrypt Your Age",
    description: "Your age is encrypted using Fully Homomorphic Encryption before leaving your device.",
    color: "purple" as const,
  },
  {
    icon: Database,
    title: "Store On-Chain",
    description: "The encrypted value is stored on the blockchain. Nobody can see your actual age.",
    color: "cyan" as const,
  },
  {
    icon: CheckCircle,
    title: "Verify Privately",
    description: "Smart contracts verify conditions (e.g., 'over 18?') without ever decrypting.",
    color: "green" as const,
  },
];

const benefits = [
  {
    icon: Eye,
    title: "Complete Privacy",
    description: "Your exact age is never revealed. Only boolean verification results are shared.",
  },
  {
    icon: Shield,
    title: "Cryptographic Security",
    description: "Built on TFHE (Fully Homomorphic Encryption) with mathematical security guarantees.",
  },
  {
    icon: Zap,
    title: "Instant Verification",
    description: "Get verified in seconds without manual document review or KYC delays.",
  },
  {
    icon: Key,
    title: "You Stay in Control",
    description: "Only you can authorize verifications. Revoke access anytime.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-neon-purple/10 dark:via-transparent dark:to-neon-cyan/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 dark:bg-neon-purple/10 rounded-full blur-3xl" />
        </div>

        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 dark:bg-neon-purple/20 dark:text-neon-purple dark:border dark:border-neon-purple/30">
              <Shield className="h-4 w-4" />
              Powered by Fully Homomorphic Encryption
            </div>

            <h1
              className={cn(
                "text-4xl md:text-6xl font-bold tracking-tight mb-6",
                "bg-clip-text text-transparent",
                "bg-gradient-to-r from-foreground to-foreground/70",
                "dark:from-white dark:via-neon-purple dark:to-neon-cyan"
              )}
            >
              Prove Your Age
              <br />
              Without Revealing It
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The first privacy-preserving age verification system. Using FHE technology,
              prove you meet age requirements without exposing your actual birthdate.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className={cn(
                  "gap-2 text-lg px-8",
                  "dark:bg-gradient-to-r dark:from-neon-purple dark:to-neon-cyan",
                  "dark:hover:shadow-[0_0_30px_hsl(var(--neon-purple)/0.5)]",
                  "dark:transition-shadow"
                )}
              >
                <Link to="/dashboard">
                  Try Demo
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 dark:border-neon-cyan/50 dark:text-neon-cyan dark:hover:bg-neon-cyan/10"
              >
                <Link to="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-secondary/30 dark:bg-card/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to verify your age while keeping your data completely private.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border dark:bg-primary/20" />
                )}
                <GlowCard glowColor={step.color} className="text-center relative">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4",
                      "bg-primary/10 text-primary",
                      step.color === "purple" && "dark:bg-neon-purple/20 dark:text-neon-purple",
                      step.color === "cyan" && "dark:bg-neon-cyan/20 dark:text-neon-cyan",
                      step.color === "green" && "dark:bg-neon-green/20 dark:text-neon-green"
                    )}
                  >
                    <step.icon className="h-8 w-8" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold dark:bg-neon-purple dark:shadow-[0_0_15px_hsl(var(--neon-purple)/0.5)]">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </GlowCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose AgeVault?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for a world where privacy is a right, not a privilege.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <GlowCard
                key={index}
                glowColor={index % 2 === 0 ? "purple" : "cyan"}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 dark:bg-neon-purple/20 dark:text-neon-purple">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5 dark:bg-neon-purple/5">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience Private Verification?</h2>
            <p className="text-muted-foreground mb-8">
              Try our demo to see how FHE-powered age verification works in practice.
            </p>
            <Button
              asChild
              size="lg"
              className={cn(
                "gap-2 text-lg px-8",
                "dark:bg-gradient-to-r dark:from-neon-purple dark:to-neon-cyan",
                "dark:hover:shadow-[0_0_30px_hsl(var(--neon-purple)/0.5)]"
              )}
            >
              <Link to="/dashboard">
                Launch Demo
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
