import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

if (projectId === 'YOUR_PROJECT_ID') {
  console.warn(
    '⚠️ WalletConnect Project ID not set. Please set VITE_WALLETCONNECT_PROJECT_ID in your .env file. ' +
    'Get one at https://cloud.walletconnect.com'
  );
}

import { http } from 'wagmi';

const alchemyUrl = 'https://eth-sepolia.g.alchemy.com/v2/A4RzNvTZFalntQVYsz8om';
const rpcUrl = import.meta.env.VITE_SEPOLIA_RPC_URL || alchemyUrl;

export const config = getDefaultConfig({
  appName: 'Private Age Check',
  projectId,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(rpcUrl),
  },
});
