import hardhat from "hardhat";

async function main() {
    const KmsC = "0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A";

    // Try signature 1
    try {
        const kms = await hardhat.ethers.getContractAt(
            ["function getPublicKey() view returns (bytes)"],
            KmsC
        );
        console.log("Attempting getPublicKey()...");
        const pk = await kms.getPublicKey();
        console.log("Public Key Found via getPublicKey:", pk);
        return;
    } catch (e) {
        console.log("getPublicKey failed:", e.message);
    }

    // Try signature 2
    try {
        const kms = await hardhat.ethers.getContractAt(
            ["function publicKey() view returns (bytes)"],
            KmsC
        );
        console.log("Attempting publicKey()...");
        const pk = await kms.publicKey();
        console.log("Public Key Found via publicKey:", pk);
        return;
    } catch (e) {
        console.log("publicKey failed:", e.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
