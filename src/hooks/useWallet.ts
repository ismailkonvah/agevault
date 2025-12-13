import { useState, useCallback } from "react";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
  });

  const connect = useCallback(async () => {
    setWallet((prev) => ({ ...prev, isConnecting: true }));
    
    // Simulate wallet connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Generate a mock wallet address
    const mockAddress = `0x${Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;

    setWallet({
      address: mockAddress,
      isConnected: true,
      isConnecting: false,
    });

    return mockAddress;
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      address: null,
      isConnected: false,
      isConnecting: false,
    });
  }, []);

  const truncatedAddress = wallet.address
    ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
    : null;

  return {
    ...wallet,
    truncatedAddress,
    connect,
    disconnect,
  };
}
