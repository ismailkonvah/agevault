import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("AgeCheck Contract Tests", function () {
    let ageCheck;
    let owner;
    let user1;
    let user2;

    beforeEach(async function () {
        // Get signers
        [owner, user1, user2] = await ethers.getSigners();

        // Deploy contract
        const AgeCheckFactory = await ethers.getContractFactory("AgeCheck");
        ageCheck = await AgeCheckFactory.deploy();
        await ageCheck.waitForDeployment();
    });

    describe("Deployment", function () {
        it("should deploy successfully and have a valid address", async function () {
            const address = await ageCheck.getAddress();
            expect(address).to.be.properAddress;
        });

        it("should initially show false for hasEncryptedAge for any user", async function () {
            expect(await ageCheck.hasEncryptedAge(user1.address)).to.equal(false);
        });
    });

    describe("State Management", function () {
        it("should fail to getEncryptedAge if no age is submitted", async function () {
            await expect(ageCheck.getEncryptedAge(user1.address)).to.be.revertedWith(
                "User has not submitted an age"
            );
        });

        it("should fail to verifyAge if no age is submitted", async function () {
            await expect(ageCheck.verifyAge(user1.address, 18)).to.be.revertedWith(
                "User has not submitted an age"
            );
        });
    });

    describe("FHEVM Integration (Logic Only)", function () {
        it("should correctly handle contract calls", async function () {
            // This confirms the ABI and contract methods are accessible
            const hasAge = await ageCheck.hasEncryptedAge(user2.address);
            expect(hasAge).to.equal(false);
        });
    });
});
