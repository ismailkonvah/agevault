import { useEffect, useState } from "react";
import { Lock, Shield, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EncryptionAnimationProps {
  isActive: boolean;
  inputValue?: string;
  onComplete?: () => void;
}

const matrixChars = "01アイウエオカキクケコサシスセソタチツテト";

export function EncryptionAnimation({
  isActive,
  inputValue = "25",
}: EncryptionAnimationProps) {
  const [encryptedText, setEncryptedText] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setEncryptedText("");
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setEncryptedText(
        Array.from(
          { length: 24 },
          () => matrixChars[Math.floor(Math.random() * matrixChars.length)]
        ).join("")
      );
      setProgress((prev) => Math.min(prev + 4, 100));
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 dark:border-primary/30 dark:bg-card/50">
      {/* Background effect for dark mode */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-cyan/5" />
        {/* Matrix rain effect */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-neon-green/20 font-mono text-xs animate-matrix-rain"
              style={{
                left: `${i * 10}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            >
              {Array.from({ length: 20 }).map((_, j) => (
                <div key={j}>
                  {matrixChars[Math.floor(Math.random() * matrixChars.length)]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Header */}
        <div className="flex items-center gap-2 text-primary dark:text-neon-purple">
          <Lock className="h-5 w-5 animate-pulse" />
          <span className="font-semibold">Encrypting with FHE</span>
        </div>

        {/* Animation container */}
        <div className="flex items-center gap-4 w-full max-w-md">
          {/* Input value */}
          <div className="flex-shrink-0">
            <div
              className={cn(
                "w-16 h-16 rounded-lg flex items-center justify-center",
                "bg-secondary text-2xl font-bold",
                "dark:bg-neon-purple/20 dark:text-neon-purple dark:border dark:border-neon-purple/50",
                "animate-encrypt-pulse"
              )}
            >
              {inputValue}
            </div>
          </div>

          {/* Arrow / Processing */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary dark:text-neon-cyan" />
            <Shield className="h-6 w-6 text-primary dark:text-neon-purple dark:animate-glow-pulse" />
          </div>

          {/* Encrypted output */}
          <div className="flex-1 min-w-0">
            <div
              className={cn(
                "p-3 rounded-lg font-mono text-xs break-all",
                "bg-muted text-muted-foreground",
                "dark:bg-neon-green/10 dark:text-neon-green dark:border dark:border-neon-green/30"
              )}
            >
              {encryptedText || "..."}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md">
          <div className="h-2 rounded-full bg-secondary dark:bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-100",
                "bg-primary dark:bg-gradient-to-r dark:from-neon-purple dark:to-neon-cyan"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {progress < 100
              ? "Homomorphic encryption in progress..."
              : "Encryption complete!"}
          </p>
        </div>
      </div>
    </div>
  );
}
