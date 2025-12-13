import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "purple" | "cyan" | "green";
}

export function GlowCard({
  children,
  className,
  glowColor = "purple",
}: GlowCardProps) {
  const glowClasses = {
    purple: "dark:hover:shadow-[0_0_30px_hsl(var(--neon-purple)/0.3)]",
    cyan: "dark:hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.3)]",
    green: "dark:hover:shadow-[0_0_30px_hsl(var(--neon-green)/0.3)]",
  };

  const borderClasses = {
    purple: "dark:border-neon-purple/20 dark:hover:border-neon-purple/50",
    cyan: "dark:border-neon-cyan/20 dark:hover:border-neon-cyan/50",
    green: "dark:border-neon-green/20 dark:hover:border-neon-green/50",
  };

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6 transition-all duration-300",
        "hover:shadow-lg",
        "dark:bg-card/50 dark:backdrop-blur-sm",
        glowClasses[glowColor],
        borderClasses[glowColor],
        className
      )}
    >
      {children}
    </div>
  );
}
