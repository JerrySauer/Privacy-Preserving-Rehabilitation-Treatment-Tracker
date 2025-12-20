# Automation Scripts

This directory contains automation tools for the Privacy-Preserving Rehabilitation Treatment Tracker FHEVM example project.

## Available Scripts

### create-fhevm-example.ts

**Purpose:** Generate standalone FHEVM example repositories

**Description:**
Creates complete, ready-to-use standalone repositories for individual FHEVM examples. The script clones the base template, copies the specified contract and test files, updates configuration, and generates documentation.

**Usage:**
```bash
# Using npm script (recommended)
npm run create-example privacy-rehabilitation-record ./output/my-example

# Or directly with ts-node
ts-node scripts/create-fhevm-example.ts privacy-rehabilitation-record ./output/my-example

# See help
npm run help:examples
```

**Arguments:**
- `example-name` (required): Name of the example to generate
- `output-dir` (optional): Output directory path (default: `./output/fhevm-example-{name}`)

**Available Examples:**
- `privacy-rehabilitation-record` - Healthcare rehabilitation tracking with FHEVM

**What it does:**
1. Copies the base-template directory structure
2. Replaces template contract with specified example contract
3. Replaces template tests with specified example tests
4. Updates `package.json` with example-specific information
5. Generates deployment script for the contract
6. Creates a custom README with usage instructions
7. Preserves all necessary configuration files

**Output Structure:**
```
output/my-example/
├── contracts/
│   └── PrivacyRehabilitationRecord.sol
├── test/
│   └── PrivacyRehabilitationRecord.test.ts
├── deploy/
│   └── deploy.ts
├── tasks/
│   └── accounts.ts
├── scripts/
│   └── deploy.js
├── hardhat.config.ts
├── package.json
├── tsconfig.json
├── .gitignore
├── .env.example
└── README.md
```

**Examples:**
```bash
# Generate to default location
npm run create-example privacy-rehabilitation-record

# Generate to specific directory
npm run create-example privacy-rehabilitation-record ./my-fhevm-app

# Generate and test
npm run create-example privacy-rehabilitation-record ./test-output
cd test-output
npm install
npm run compile
npm run test
```

### generate-docs.ts

**Purpose:** Generate GitBook-compatible documentation from code

**Description:**
Automatically extracts documentation from test files and generates comprehensive markdown documentation following GitBook format. Uses TSDoc/JSDoc annotations to create organized, navigable documentation.

**Usage:**
```bash
# Using npm script (recommended)
npm run docs

# Or directly with ts-node
ts-node scripts/generate-docs.ts
```

**What it does:**
1. Scans all test files in the `test/` directory
2. Extracts TSDoc comments (@test, @description, @chapter tags)
3. Groups documentation by chapter categories
4. Generates `DOCUMENTATION.md` with comprehensive API reference
5. Creates `SUMMARY.md` for GitBook navigation
6. Organizes content into logical sections

**Generated Files:**
- `DOCUMENTATION.md` - Complete API documentation with:
  - Overview and bounty context
  - FHEVM concepts explanation
  - Test coverage breakdown by category
  - Architecture diagrams
  - Security considerations
  - Use cases documentation

- `SUMMARY.md` - GitBook-compatible navigation with:
  - Table of contents
  - Hierarchical chapter structure
  - Links to all documentation sections

**TSDoc Annotation Format:**
```typescript
/**
 * @test Test case name
 * @description Detailed description of what this test verifies
 * @chapter category-name
 *
 * Demonstrates:
 * - Key concept 1
 * - Key concept 2
 */
it("Should do something", async function () {
  // Test implementation
});
```

**Chapter Categories:**
- `basic` - Basic FHE operations
- `encryption` - Encryption examples
- `decryption` - Decryption examples
- `access-control` - Access control patterns
- `advanced` - Advanced FHEVM patterns
- `healthcare` - Healthcare-specific examples

**Example Output:**
```markdown
# Privacy Rehabilitation Record - FHEVM Example

## Overview
...

## Key FHEVM Concepts

### Encrypted Data Types
- **euint32**: Encrypted 32-bit unsigned integers
- **euint8**: Encrypted 8-bit unsigned integers

### Access Control
- **FHE.allow()**: Grant access to encrypted values
...
```

### deploy.js

**Purpose:** Deploy the Privacy Rehabilitation Record contract

**Description:**
Standard Hardhat deployment script for deploying the main contract to various networks (local, testnet, mainnet).

**Usage:**
```bash
# Deploy to local network
npm run deploy

# Deploy to Sepolia testnet
npm run deploy -- --network sepolia

# Or directly with hardhat
npx hardhat run scripts/deploy.js --network sepolia
```

**Networks:**
- `hardhat` - Local Hardhat network (default)
- `localhost` - Local running node
- `sepolia` - Sepolia testnet

**What it does:**
1. Gets contract factory for PrivacyRehabilitationRecord
2. Deploys the contract
3. Waits for confirmations
4. Outputs deployment information (address, network, tx hash)
5. Provides next steps for verification

**Output:**
```
Deploying Privacy Rehabilitation Records contract...
✅ Contract deployed successfully!
📄 Contract address: 0x...
🔗 Network: sepolia
📋 Deployment Details:
{
  "contractAddress": "0x...",
  "network": "sepolia",
  "deploymentTime": "2025-12-15T...",
  "txHash": "0x..."
}
```

## Development Workflow

### Creating a New Example

1. **Write the contract** in `contracts/`
2. **Write comprehensive tests** in `test/`
3. **Add to EXAMPLES_MAP** in `create-fhevm-example.ts`
4. **Test locally:**
   ```bash
   npm run compile
   npm run test
   ```
5. **Generate standalone repository:**
   ```bash
   npm run create-example my-example ./test-output
   ```
6. **Test standalone version:**
   ```bash
   cd ./test-output
   npm install
   npm run compile
   npm run test
   ```

### Updating Documentation

1. **Update TSDoc comments** in test files
2. **Update NatSpec comments** in contract files
3. **Regenerate documentation:**
   ```bash
   npm run docs
   ```
4. **Review generated files:**
   - `DOCUMENTATION.md`
   - `SUMMARY.md`

### Testing Automation

```bash
# Test example generation
npm run create-example privacy-rehabilitation-record ./test-gen
cd test-gen
npm install && npm run compile && npm run test

# Clean up
cd ..
rm -rf test-gen
```

## Script Maintenance

### Adding New Examples

Edit `create-fhevm-example.ts`:

```typescript
const EXAMPLES_MAP: Record<string, ExampleConfig> = {
  // Add your new example here
  'my-new-example': {
    contract: 'contracts/MyContract.sol',
    test: 'test/MyContract.test.ts',
    description: 'Brief description of the example',
  },
};
```

### Customizing Documentation

Edit `generate-docs.ts`:

1. Update template strings for custom formatting
2. Add new chapter categories
3. Modify extraction logic for different comment patterns
4. Customize output file structure

### Updating Base Template

When updating the base template:

1. Modify files in `base-template/`
2. Test with a regenerated example
3. Update this README with any changes
4. Document breaking changes in DEVELOPER_GUIDE.md

## Error Handling

### Common Issues

**Script fails with "Example not found":**
- Check that the example name matches exactly
- Run `npm run help:examples` to see available examples

**Generated example won't compile:**
- Ensure source contract compiles first
- Check import paths in copied files
- Verify Solidity version compatibility

**Documentation generation fails:**
- Check TSDoc comment formatting
- Ensure test files use proper structure
- Verify file permissions

## Best Practices

1. **Keep scripts simple and focused** - Each script should do one thing well
2. **Add clear error messages** - Help users understand what went wrong
3. **Provide helpful output** - Use colors and formatting for clarity
4. **Validate inputs** - Check file existence and parameter validity
5. **Document thoroughly** - Include JSDoc comments and usage examples

## Future Enhancements

Potential improvements for these scripts:

- [ ] Add support for category-based project generation (multiple examples)
- [ ] Implement automatic dependency version updates
- [ ] Add validation for generated repositories
- [ ] Create interactive CLI with prompts
- [ ] Add support for custom templates
- [ ] Implement bulk operations for multiple examples

## License

These scripts are part of the Privacy-Preserving Rehabilitation Treatment Tracker project and are licensed under the BSD-3-Clause-Clear License.

---

**For questions or issues with these scripts, please refer to the DEVELOPER_GUIDE.md or open an issue on GitHub.**
