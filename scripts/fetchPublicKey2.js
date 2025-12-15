import hardhat from "hardhat";

async function main() {
    const KmsC = "0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A";

    const signatures = [
        "function getPublicKey() view returns (bytes)",
        "function publicKey() view returns (bytes)",
        "function fhePubKey() view returns (bytes)",
        "function getFhePubKey() view returns (bytes)",
        "function verifyingKey() view returns (bytes)",
        "function getVerifyingKey() view returns (bytes)",
        "function key() view returns (bytes)",
        "function getKey() view returns (bytes)"
    ];

    for (const sig of signatures) {
        try {
            const kms = await hardhat.ethers.getContractAt([sig], KmsC);
            const fname = sig.split(" ")[1].split("(")[0];
            console.log(`Attempting ${fname}()...`);
            const pk = await kms[fname]();
            console.log(`SUCCESS! Public Key found via ${fname}:`, pk);
            return;
        } catch (e) {
            console.log(`Failed: ${e.message.split('(')[0]}`);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
