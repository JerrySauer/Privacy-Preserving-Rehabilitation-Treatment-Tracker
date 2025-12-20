# Developer Guide

## Overview

This guide explains how to work with the Privacy-Preserving Rehabilitation Treatment Tracker FHEVM example project, including how to generate standalone repositories, update dependencies, and add new examples.

## Project Structure

```
PrivacyRehabilitationRecord/
├── base-template/              # Base Hardhat template for FHEVM
│   ├── contracts/              # Template contract (Example.sol)
│   ├── test/                   # Template tests
│   ├── deploy/                 # Deployment scripts
│   ├── tasks/                  # Hardhat tasks
│   ├── hardhat.config.ts       # Hardhat configuration
│   ├── package.json            # Dependencies
│   └── README.md               # Template README
│
├── contracts/                  # Example contract(s)
│   └── PrivacyRehabilitationRecord.sol
│
├── test/                       # Test files
│   └── PrivacyRehabilitationRecord.test.ts
│
├── scripts/                    # Automation tools
│   ├── create-fhevm-example.ts # Repository generator
│   ├── generate-docs.ts        # Documentation generator
│   └── deploy.js               # Deployment script
│
├── public/                     # Frontend interface
│   └── index.html
│
├── README.md                   # Project documentation
├── BOUNTY_SUBMISSION.md        # Bounty submission details
├── DEVELOPER_GUIDE.md          # This file
└── package.json                # Project dependencies
```

## Quick Start

### Prerequisites

- Node.js 20 or higher
- npm 7.0.0 or higher
- Git

### Installation

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm run test
```

## Generating Standalone Examples

### Generate a Single Example

Use the automation script to create a standalone repository:

```bash
# Using npm script (recommended)
npm run create-example privacy-rehabilitation-record ./output/my-example

# Or directly with ts-node
ts-node scripts/create-fhevm-example.ts privacy-rehabilitation-record ./output/my-example
```

This will:
1. Copy the base-template directory
2. Copy the specified contract and test files
3. Update configuration files
4. Generate a README with usage instructions
5. Create deployment scripts

### See Available Examples

```bash
npm run help:examples
```

## Automation Scripts

### create-fhevm-example.ts

Generates complete standalone repositories for single examples.

**Features:**
- Clones base template
- Copies contract and test files
- Updates package.json and deployment scripts
- Generates custom README
- Maintains proper directory structure

**Usage:**
```bash
ts-node scripts/create-fhevm-example.ts <example-name> [output-dir]
```

**Available examples:**
- `privacy-rehabilitation-record` - Healthcare rehabilitation tracking with FHEVM

### generate-docs.ts

Creates GitBook-compatible documentation from code annotations.

**Features:**
- Extracts documentation from test files via TSDoc comments
- Generates DOCUMENTATION.md with organized sections
- Creates SUMMARY.md for GitBook navigation
- Automatically categorizes by chapter tags

**Usage:**
```bash
npm run docs
```

**Generated files:**
- `DOCUMENTATION.md` - Complete API documentation
- `SUMMARY.md` - GitBook-compatible navigation

## Adding New Examples

To add a new FHEVM example to this project:

### Step 1: Create Contract

Create your Solidity contract in `contracts/`:

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title My New Example
/// @notice Description of what this example demonstrates
contract MyNewExample is ZamaEthereumConfig {
  // Your implementation
}
```

### Step 2: Create Tests

Create comprehensive tests in `test/`:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

/**
 * @test My New Example Test Suite
 * @description Tests for the MyNewExample FHEVM contract
 * @chapter category-name
 */
describe("MyNewExample", function () {
  // Your tests
});
```

### Step 3: Update Automation Script

Add your example to `scripts/create-fhevm-example.ts`:

```typescript
const EXAMPLES_MAP: Record<string, ExampleConfig> = {
  // ... existing examples
  'my-new-example': {
    contract: 'contracts/MyNewExample.sol',
    test: 'test/MyNewExample.test.ts',
    description: 'Brief description of what this example demonstrates',
  },
};
```

### Step 4: Test the Example

```bash
# Compile and test
npm run compile
npm run test

# Generate standalone repository
npm run create-example my-new-example ./test-output

# Test standalone version
cd ./test-output
npm install
npm run compile
npm run test
```

### Step 5: Generate Documentation

```bash
npm run docs
```

## Updating Dependencies

When FHEVM library releases a new version:

### Update Base Template

```bash
cd base-template/
npm install @fhevm/solidity@latest
# Update other dependencies as needed
```

### Update Main Project

```bash
npm install @fhevm/solidity@latest
npm run compile
npm run test
```

### Test Generated Examples

Regenerate and test a few key examples to ensure compatibility:

```bash
npm run create-example privacy-rehabilitation-record ./test-output/test
cd ./test-output/test
npm install
npm run compile
npm run test
```

## Testing Workflow

### Local Development

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npx hardhat test test/PrivacyRehabilitationRecord.test.ts
```

### Testing on Sepolia

```bash
# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Deploy to Sepolia
npm run deploy

# Test frontend
npm run dev
# Navigate to http://localhost:3000
```

## Documentation Guidelines

### Contract Documentation (NatSpec)

Use NatSpec comments for all public/external functions:

```solidity
/**
 * @notice Human-readable description
 * @dev Implementation details
 * @param paramName Parameter description
 * @return Description of return value
 * @custom:fhevm FHEVM operations used
 * @custom:security Security considerations
 * @custom:access Access control requirements
 */
function myFunction(uint256 paramName) external returns (uint256) {
  // Implementation
}
```

### Test Documentation (TSDoc)

Include TSDoc comments for all test cases:

```typescript
/**
 * @test Test case name
 * @description What the test verifies
 * @chapter documentation-category
 *
 * Demonstrates:
 * - Key concept 1
 * - Key concept 2
 */
it("Should perform expected behavior", async function () {
  // Test implementation
});
```

### Chapter Tags

Use these chapter tags for organizing documentation:

- `basic` - Basic FHE operations
- `encryption` - Encryption examples
- `decryption` - Decryption examples
- `access-control` - Access control patterns
- `advanced` - Advanced FHEVM patterns
- `healthcare` - Healthcare-specific examples

## Troubleshooting

### Common Issues

**Issue: Contract compilation fails**
```bash
# Clean build artifacts
npm run clean
npm run compile
```

**Issue: Tests fail with permission errors**
- Ensure FHE.allowThis() is called for contract access
- Ensure FHE.allow() is called for user access
- Check that msg.sender matches the encryption signer

**Issue: Generated example won't compile**
- Check that all import paths are correct
- Ensure dependencies are properly installed
- Verify Solidity version compatibility

### Getting Help

- [Zama Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Examples](https://docs.zama.org/protocol/examples)
- [Zama Discord](https://discord.gg/zama)
- [GitHub Issues](https://github.com/zama-ai/fhevm/issues)

## Best Practices

### Contract Development

1. **Always grant both permissions:**
   ```solidity
   FHE.allowThis(encryptedValue);        // Contract permission
   FHE.allow(encryptedValue, msg.sender); // User permission
   ```

2. **Match encryption signer:**
   ```typescript
   const enc = await fhevm.createEncryptedInput(contractAddr, alice.address);
   await contract.connect(alice).operate(enc.handles[0], enc.inputProof);
   ```

3. **Validate inputs:**
   ```solidity
   require(progressScore <= 100, "Score must be <= 100");
   require(duration > 0, "Duration must be positive");
   ```

### Test Development

1. Include both success and failure cases
2. Test boundary conditions
3. Verify event emissions
4. Check access control enforcement
5. Document all test cases with TSDoc

### Documentation

1. Use clear, concise language
2. Include code examples
3. Explain the "why" not just the "what"
4. Keep documentation up-to-date with code changes

## Contributing

Contributions are welcome! When contributing:

1. Follow existing code style and patterns
2. Add comprehensive tests for new features
3. Update documentation
4. Ensure all tests pass
5. Follow commit message conventions

## License

This project is licensed under the BSD-3-Clause-Clear License.

---

**For questions or support, please open an issue on GitHub or join the Zama Discord community.**
