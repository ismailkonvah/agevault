// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";
import "@fhevm/solidity/config/ZamaConfig.sol";

contract AgeCheck is ZamaEthereumConfig {
    // Store encrypted age for each user
    mapping(address => euint8) internal encryptedAges;

    // Events
    event AgeSubmitted(address indexed user, bytes32 encryptedAge);

    /**
     * @notice Submit encrypted age using FHEVM v0.10.0 standard
     */
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
    function verifyAge(address user, uint8 threshold) public returns (ebool) {
        require(FHE.isInitialized(encryptedAges[user]), "User has not submitted an age");
        
        euint8 userAge = encryptedAges[user];
        euint8 encryptedThreshold = FHE.asEuint8(threshold);
        
        // Compare encrypted values
        return FHE.ge(userAge, encryptedThreshold);
    }

    // Get encrypted age for a user (returns as bytes32 handle)
    function getEncryptedAge(address user) public view returns (bytes32) {
        require(FHE.isInitialized(encryptedAges[user]), "User has not submitted an age");
        return FHE.toBytes32(encryptedAges[user]);
    }
}
