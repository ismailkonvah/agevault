// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";
import "encrypted-types/EncryptedTypes.sol";

contract AgeCheck {
    // Store encrypted age for each user
    mapping(address => euint8) internal encryptedAges;

    // Submit encrypted age
    function submitAge(externalEuint8 encryptedAge, bytes calldata inputProof) public {
        encryptedAges[msg.sender] = FHE.fromExternal(encryptedAge, inputProof);
    }


    // Check if user has submitted an age
    function hasEncryptedAge(address user) public view returns (bool) {
        return FHE.isInitialized(encryptedAges[user]);
    }
}
