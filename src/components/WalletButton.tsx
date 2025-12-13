import { Wallet, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WalletButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  truncatedAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletButton({
  isConnected,
  isConnecting,
  truncatedAddress,
  onConnect,
  onDisconnect,
}: WalletButtonProps) {
  if (isConnected && truncatedAddress) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 border border-success/20 dark:bg-neon-green/10 dark:border-neon-green/30">
          <div className="h-2 w-2 rounded-full bg-success dark:bg-neon-green animate-pulse" />
          <span className="font-mono text-sm text-success dark:text-neon-green">
            {truncatedAddress}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDisconnect}
          className="h-9 w-9 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={onConnect}
      disabled={isConnecting}
      className={cn(
        "gap-2 transition-all",
        "dark:bg-gradient-to-r dark:from-neon-purple dark:to-neon-cyan dark:text-white",
        "dark:hover:shadow-[0_0_20px_hsl(var(--neon-purple)/0.5)]"
      )}
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}
