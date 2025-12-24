import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

if (projectId === 'YOUR_PROJECT_ID') {
  console.warn(
    '⚠️ WalletConnect Project ID not set. Please set VITE_WALLETCONNECT_PROJECT_ID in your .env file. ' +
    'Get one at https://cloud.walletconnect.com'
  );
}

const defaultRpcUrl = 'https://rpc.sepolia.zama.ai';
const rpcUrl = import.meta.env.VITE_SEPOLIA_RPC_URL || defaultRpcUrl;

export const config = getDefaultConfig({
  appName: 'Private Age Check',
  projectId,
  chains: [
    {
      ...sepolia,
      rpcUrls: {
        ...sepolia.rpcUrls,
        default: { http: [rpcUrl] },
        public: { http: [rpcUrl] },
      },
    }
  ],
});
