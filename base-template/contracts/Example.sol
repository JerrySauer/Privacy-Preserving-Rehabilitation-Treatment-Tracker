// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Example FHEVM Contract
/// @notice This is a template contract demonstrating basic FHEVM operations
contract Example is ZamaEthereumConfig {
  euint32 private encryptedValue;

  event ValueSet(uint256 timestamp);

  /**
   * @notice Set encrypted value
   * @param inputEuint32 Encrypted value
   * @param inputProof Input proof for verification
   */
  function setValue(externalEuint32 inputEuint32, bytes calldata inputProof) external {
    euint32 encryptedEuint32 = FHE.fromExternal(inputEuint32, inputProof);

    encryptedValue = encryptedEuint32;

    FHE.allowThis(encryptedValue);
    FHE.allow(encryptedValue, msg.sender);

    emit ValueSet(block.timestamp);
  }

  /**
   * @notice Get encrypted value (only callable by contract and owner)
   * @return euint32 Encrypted value
   */
  function getValue() external view returns (euint32) {
    return encryptedValue;
  }
}
