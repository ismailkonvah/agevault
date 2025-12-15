# Private Age Check

**Private Age Check** is a privacy-preserving application that allows users to verify their age without revealing it, using **Fully Homomorphic Encryption (FHE)** powered by [Zama](https://www.zama.ai/) and the **Sepolia Testnet**.

## Features

*   **Privacy-First Verification**: Users encrypt their age locally using FHE. The encrypted age is submitted on-chain and verified against thresholds (e.g., "Is Over 18?") without ever decrypting the actual value.
*   **Wallet Integration**: Seamlessly connect your wallet (MetaMask, Rabbit, etc.) using [RainbowKit](https://www.rainbowkit.com/) and [WalletConnect](https://walletconnect.com/).
*   **Real Encryption**: Utilizes `fhevmjs` to perform actual FHE encryption in the browser.
*   **Modern UI**: Built with React, Vite, Tailwind CSS, and shadcn/ui for a premium, responsive experience.

## Tech Stack

*   **Frontend**: React, TypeScript, Vite
*   **Styling**: Tailwind CSS, shadcn/ui
*   **Web3**: wagmi, viem, RainbowKit
*   **Encryption**: Zama `fhevmjs`

## Getting Started

### Prerequisites

*   Node.js (v18+ recommended)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd private-age-check
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Configuration

1.  **Project ID**: The application uses a placeholder WalletConnect Project ID. Obtain a free Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/) and update it in `src/wagmi.ts`:
    ```typescript
    projectId: 'YOUR_PROJECT_ID',
    ```

### Run Locally

Start the development server:

```bash
npm run dev
```

Open your browser to `http://localhost:8080`.

## How It Works

1.  **Connect Wallet**: Connect your Web3 wallet to the Sepolia network.
2.  **Encrypt Age**: On the Dashboard, enter your age. It is encrypted locally using FHE.
3.  **Submit**: The encrypted age is "submitted" (stored in local state for this demo, or sent to a contract in production).
4.  **Verify**: Go to the **Verify** page. You can check conditions like "Is Over 18?". The validation happens on the encrypted data, returning a boolean result without revealing the age.

## License

MIT
