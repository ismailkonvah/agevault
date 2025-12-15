import hardhat from "hardhat";

async function main() {
    const Coprocessor = "0x92C920834Ec8941d2C77D188936E1f7A6f49c127";

    const signatures = [
        "function getPublicKey() view returns (bytes)",
        "function publicKey() view returns (bytes)",
        "function fhePubKey() view returns (bytes)"
    ];

    for (const sig of signatures) {
        try {
            const c = await hardhat.ethers.getContractAt([sig], Coprocessor);
            const fname = sig.split(" ")[1].split("(")[0];
            console.log(`Attempting ${fname} on Coprocessor...`);
            const pk = await c[fname]();
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
