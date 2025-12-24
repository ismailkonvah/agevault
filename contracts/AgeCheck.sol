// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/config/ZamaConfig.sol";

contract AgeCheck is ZamaEthereumConfig {
    // Store encrypted age for each user
    mapping(address => euint8) internal encryptedAges;

    // Events
    event AgeSubmitted(address indexed user, bytes32 encryptedAge);

    // Submit encrypted age
    function submitAge(einput ageInput, bytes calldata inputProof) public {
        euint8 age = TFHE.asEuint8(ageInput, inputProof);
        encryptedAges[msg.sender] = age;
        emit AgeSubmitted(msg.sender, TFHE.toBytes32(age));
    }

    // Check if user has submitted an age
    function hasEncryptedAge(address user) public view returns (bool) {
        return TFHE.isInitialized(encryptedAges[user]);
    }

    // Verify if user's encrypted age is greater than or equal to threshold
    function verifyAge(address user, uint8 threshold) public returns (ebool) {
        require(TFHE.isInitialized(encryptedAges[user]), "User has not submitted an age");
        
        euint8 userAge = encryptedAges[user];
        euint8 encryptedThreshold = TFHE.asEuint8(threshold);
        
        // Compare encrypted values
        return TFHE.ge(userAge, encryptedThreshold);
    }

    // Get encrypted age for a user (returns as bytes32 for external use)
    function getEncryptedAge(address user) public view returns (bytes32) {
        require(TFHE.isInitialized(encryptedAges[user]), "User has not submitted an age");
        return TFHE.toBytes32(encryptedAges[user]);
    }
}
