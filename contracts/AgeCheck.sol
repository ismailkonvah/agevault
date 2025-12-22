// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import "encrypted-types/EncryptedTypes.sol";

contract AgeCheck is ZamaEthereumConfig {
    // Store encrypted age for each user
    mapping(address => euint8) internal encryptedAges;

    // Events
    event AgeSubmitted(address indexed user, bytes32 encryptedAge);
    event AgeVerified(address indexed user, uint8 threshold, bool result);

    // Submit encrypted age
    function submitAge(externalEuint8 encryptedAge, bytes calldata inputProof) public {
        euint8 age = FHE.fromExternal(encryptedAge, inputProof);
        encryptedAges[msg.sender] = age;
        emit AgeSubmitted(msg.sender, FHE.toBytes32(age));
    }

    // Check if user has submitted an age
    function hasEncryptedAge(address user) public view returns (bool) {
        return FHE.isInitialized(encryptedAges[user]);
    }

    // Verify if user's encrypted age is greater than or equal to threshold
    // Returns an encrypted boolean (ebool) that can be decrypted by authorized parties
    // Note: FHE operations are not view functions as they interact with the FHEVM executor
    function verifyAge(address user, uint8 threshold) public returns (ebool) {
        require(FHE.isInitialized(encryptedAges[user]), "User has not submitted an age");
        
        euint8 userAge = encryptedAges[user];
        euint8 encryptedThreshold = FHE.asEuint8(threshold);
        
        // Compare encrypted values - returns encrypted boolean
        // ge = greater than or equal
        ebool result = FHE.ge(userAge, encryptedThreshold);
        
        return result;
    }

    // Get encrypted age for a user (returns as bytes32 for external use)
    function getEncryptedAge(address user) public view returns (bytes32) {
        require(FHE.isInitialized(encryptedAges[user]), "User has not submitted an age");
        return FHE.toBytes32(encryptedAges[user]);
    }
}
