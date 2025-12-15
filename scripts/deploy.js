
import hre from "hardhat";

async function main() {
    console.log("Deploying AgeCheck contract...");

    const AgeCheck = await hre.ethers.getContractFactory("AgeCheck");
    const ageCheck = await AgeCheck.deploy();

    await ageCheck.waitForDeployment();

    console.log("AgeCheck deployed to:", await ageCheck.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
