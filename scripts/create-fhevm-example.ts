#!/usr/bin/env ts-node

/**
 * create-fhevm-example - CLI tool to generate standalone FHEVM example repositories
 *
 * Usage: ts-node scripts/create-fhevm-example.ts <example-name> [output-dir]
 *
 * Example: ts-node scripts/create-fhevm-example.ts privacy-rehabilitation-record ./my-example
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Color codes for terminal output
enum Color {
  Reset = '\x1b[0m',
  Green = '\x1b[32m',
  Blue = '\x1b[34m',
  Yellow = '\x1b[33m',
  Red = '\x1b[31m',
  Cyan = '\x1b[36m',
}

function log(message: string, color: Color = Color.Reset): void {
  console.log(`${color}${message}${Color.Reset}`);
}

function error(message: string): never {
  log(`❌ Error: ${message}`, Color.Red);
  process.exit(1);
}

function success(message: string): void {
  log(`✅ ${message}`, Color.Green);
}

function info(message: string): void {
  log(`ℹ️  ${message}`, Color.Blue);
}

// Example configuration interface
interface ExampleConfig {
  contract: string;
  test: string;
  description: string;
}

// Map of example names to their contract and test paths
const EXAMPLES_MAP: Record<string, ExampleConfig> = {
  'privacy-rehabilitation-record': {
    contract: 'contracts/PrivacyRehabilitationRecord.sol',
    test: 'test/PrivacyRehabilitationRecord.test.ts',
    description: 'Privacy-preserving rehabilitation treatment tracking using FHEVM encryption',
  },
};

function copyDirectoryRecursive(source: string, destination: string): void {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const items = fs.readdirSync(source);

  items.forEach(item => {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      // Skip node_modules, artifacts, cache, etc.
      if (['node_modules', 'artifacts', 'cache', 'coverage', 'types', 'dist', '.git'].includes(item)) {
        return;
      }
      copyDirectoryRecursive(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

function getContractName(contractPath: string): string | null {
  const content = fs.readFileSync(contractPath, 'utf-8');
  const match = content.match(/^\s*contract\s+(\w+)(?:\s+is\s+|\s*\{)/m);
  return match ? match[1] : null;
}

function updateDeployScript(outputDir: string, contractName: string): void {
  const deployScriptPath = path.join(outputDir, 'scripts', 'deploy.js');

  const deployScript = `const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying ${contractName} contract...");

  // Get the contract factory
  const ${contractName} = await ethers.getContractFactory("${contractName}");

  // Deploy the contract
  const contract = await ${contractName}.deploy();
  await contract.deployed();

  console.log("✅ Contract deployed successfully!");
  console.log("📄 Contract address:", contract.address);
  console.log("🔗 Network:", network.name);

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contract.address,
    network: network.name,
    deploymentTime: new Date().toISOString(),
    txHash: contract.deployTransaction.hash
  };

  console.log("\\n📋 Deployment Details:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Wait for a few block confirmations
  console.log("\\n⏳ Waiting for block confirmations...");
  await contract.deployTransaction.wait(3);
  console.log("✅ Contract confirmed on blockchain");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
`;

  fs.writeFileSync(deployScriptPath, deployScript);
}

function updatePackageJson(outputDir: string, exampleName: string, description: string): void {
  const packageJsonPath = path.join(outputDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  packageJson.name = `fhevm-example-${exampleName.toLowerCase().replace(/\s+/g, '-')}`;
  packageJson.description = description;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function generateReadme(exampleName: string, description: string, contractName: string): string {
  return `# FHEVM Example: ${exampleName}

${description}

## Quick Start

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Package manager

### Installation

1. **Install dependencies**

   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables**

   \`\`\`bash
   cp .env.example .env
   # Edit .env with your private key and RPC URL
   \`\`\`

3. **Compile and test**

   \`\`\`bash
   npm run compile
   npm run test
   \`\`\`

## Contract

The main contract is \`${contractName}\` located in \`contracts/${contractName}.sol\`.

## Testing

Run the test suite:

\`\`\`bash
npm run test
\`\`\`

Run with coverage report:

\`\`\`bash
npm run test:coverage
\`\`\`

## Deployment

### Local Network

\`\`\`bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
\`\`\`

### Sepolia Testnet

\`\`\`bash
npx hardhat run scripts/deploy.js --network sepolia
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
\`\`\`

## Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Developer Guide](https://docs.fhevm.zama.ai)
- [Hardhat Documentation](https://hardhat.org/docs)

## License

This project is licensed under the BSD-3-Clause-Clear License.

---

**Built with ❤️ using [FHEVM](https://github.com/zama-ai/fhevm) by Zama**
`;
}

function createExample(exampleName: string, outputDir: string): void {
  const rootDir = path.resolve(__dirname, '..');
  const templateDir = path.join(rootDir, 'base-template');

  // Check if example exists
  if (!EXAMPLES_MAP[exampleName]) {
    error(\`Unknown example: \${exampleName}\\n\\nAvailable examples:\\n\${Object.keys(EXAMPLES_MAP).map(k => \`  - \${k}\`).join('\\n')}\`);
  }

  const example = EXAMPLES_MAP[exampleName];
  const contractPath = path.join(rootDir, example.contract);
  const testPath = path.join(rootDir, example.test);

  // Validate paths exist
  if (!fs.existsSync(contractPath)) {
    error(\`Contract not found: \${example.contract}\`);
  }
  if (!fs.existsSync(testPath)) {
    error(\`Test not found: \${example.test}\`);
  }

  info(\`Creating FHEVM example: \${exampleName}\`);
  info(\`Output directory: \${outputDir}\`);

  // Step 1: Copy template
  log('\\n📋 Step 1: Copying template...', Color.Cyan);
  if (fs.existsSync(outputDir)) {
    error(\`Output directory already exists: \${outputDir}\`);
  }
  copyDirectoryRecursive(templateDir, outputDir);
  success('Template copied');

  // Step 2: Copy contract
  log('\\n📄 Step 2: Copying contract...', Color.Cyan);
  const contractName = getContractName(contractPath);
  if (!contractName) {
    error('Could not extract contract name from contract file');
  }
  const destContractPath = path.join(outputDir, 'contracts', \`\${contractName}.sol\`);

  // Remove template contract
  const templateContract = path.join(outputDir, 'contracts', 'Example.sol');
  if (fs.existsSync(templateContract)) {
    fs.unlinkSync(templateContract);
  }

  fs.copyFileSync(contractPath, destContractPath);
  success(\`Contract copied: \${contractName}.sol\`);

  // Step 3: Copy test
  log('\\n🧪 Step 3: Copying test...', Color.Cyan);
  const destTestPath = path.join(outputDir, 'test', path.basename(testPath));

  // Remove template tests
  const testDir = path.join(outputDir, 'test');
  fs.readdirSync(testDir).forEach(file => {
    if (file.endsWith('.ts')) {
      fs.unlinkSync(path.join(testDir, file));
    }
  });

  fs.copyFileSync(testPath, destTestPath);
  success(\`Test copied: \${path.basename(testPath)}\`);

  // Step 4: Update configuration files
  log('\\n⚙️  Step 4: Updating configuration...', Color.Cyan);
  updateDeployScript(outputDir, contractName);
  updatePackageJson(outputDir, exampleName, example.description);
  success('Configuration updated');

  // Step 5: Generate README
  log('\\n📝 Step 5: Generating README...', Color.Cyan);
  const readme = generateReadme(exampleName, example.description, contractName);
  fs.writeFileSync(path.join(outputDir, 'README.md'), readme);
  success('README.md generated');

  // Final summary
  log('\\n' + '='.repeat(60), Color.Green);
  success(\`FHEVM example "\${exampleName}" created successfully!\`);
  log('='.repeat(60), Color.Green);

  log('\\n📦 Next steps:', Color.Yellow);
  log(\`  cd \${path.relative(process.cwd(), outputDir)}\`);
  log('  npm install');
  log('  npm run compile');
  log('  npm run test');

  log('\\n🎉 Happy coding with FHEVM!', Color.Cyan);
}

// Main execution
function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    log('FHEVM Example Generator', Color.Cyan);
    log('\\nUsage: ts-node scripts/create-fhevm-example.ts <example-name> [output-dir]\\n');
    log('Available examples:', Color.Yellow);
    Object.entries(EXAMPLES_MAP).forEach(([name, info]) => {
      log(\`  \${name}\`, Color.Green);
      log(\`    \${info.description}\`, Color.Reset);
    });
    log('\\nExample:', Color.Yellow);
    log('  ts-node scripts/create-fhevm-example.ts privacy-rehabilitation-record ./my-example\\n');
    process.exit(0);
  }

  const exampleName = args[0];
  const outputDir = args[1] || path.join(process.cwd(), 'output', \`fhevm-example-\${exampleName}\`);

  createExample(exampleName, outputDir);
}

main();
