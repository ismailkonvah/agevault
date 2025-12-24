const { ethers } = require("ethers");
require("dotenv").config();

async function checkRPC() {
    const rpcUrl = process.env.VITE_SEPOLIA_RPC_URL || process.env.SEPOLIA_RPC_URL;
    console.log(`Checking RPC: ${rpcUrl}`);

    const provider = new ethers.JsonRpcProvider(rpcUrl);

    try {
        const network = await provider.getNetwork();
        console.log(`Connected to Network: ${network.name} (ChainID: ${network.chainId})`);

        // FHEVM Precompile addresses on Sepolia (Zama)
        // Usually starting around 0x000000000000000000000000000000000000008x
        const kmsAddress = "0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A"; // KMS on Zama Sepolia

        console.log(`Checking KMS contract at ${kmsAddress}...`);
        const code = await provider.getCode(kmsAddress);

        if (code === "0x" || code === "0x0") {
            console.error("❌ FHEVM Infrastructure NOT detected on this RPC!");
            console.error("Standard Alchemy/Infura nodes do not support FHEVM.");
            console.error("You MUST use: https://rpc.sepolia.zama.ai");
        } else {
            console.log("✅ FHEVM Infrastructure detected!");
        }
    } catch (error) {
        console.error("❌ Failed to connect to RPC:", error.message);
    }
}

checkRPC();
