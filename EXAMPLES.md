# FHEVM Examples Catalog

## Overview

This repository demonstrates FHEVM (Fully Homomorphic Encryption Virtual Machine) concepts through production-quality smart contract examples. Each example showcases specific FHE patterns and best practices.

## Available Examples

### 1. Privacy-Preserving Rehabilitation Treatment Tracker

**Category:** Healthcare / Advanced

**Description:** A comprehensive healthcare system for confidential rehabilitation treatment tracking using FHEVM encryption.

**Status:** ✅ Production-Ready

#### Key Features

- **Encrypted Patient Data:** Patient IDs stored as euint32
- **Role-Based Access Control:** Admin, Therapist, and Patient roles
- **Treatment Session Recording:** Encrypted progress scores, types, and durations
- **Progress Report Generation:** Confidential assessment tracking
- **Event-Driven Audit Trail:** Transparent logging without data exposure

#### FHEVM Concepts Demonstrated

| Concept | Implementation |
|---------|----------------|
| **Encrypted Types** | euint32 (patient IDs, durations), euint8 (scores, types) |
| **Access Control** | FHE.allow(), FHE.allowThis() patterns |
| **Role-Based Permissions** | onlyAdmin, onlyAuthorizedTherapist modifiers |
| **Encrypted Operations** | Addition, comparison on encrypted values |
| **Event Emission** | Audit trails with encrypted data references |
| **Multi-User System** | Patient, therapist, admin interaction model |

#### Technical Details

**Contract:** `contracts/PrivacyRehabilitationRecord.sol`
- Lines of Code: 470+
- NatSpec Documentation: 150+ lines
- Functions: 12 public/external
- Events: 5 audit events

**Tests:** `test/PrivacyRehabilitationRecord.test.ts`
- Test Cases: 40+
- TSDoc Documentation: 200+ lines
- Coverage: Comprehensive (all functions, edge cases)
- Categories: 8 test suites

#### Code Example

```solidity
// Encrypting patient ID
euint32 encryptedPatientId = FHE.asEuint32(_patientId);

// Granting access permissions
FHE.allowThis(encryptedPatientId);
FHE.allow(encryptedPatientId, msg.sender);

// Recording encrypted treatment session
function recordTreatmentSession(
    address patientAddress,
    uint8 progressScore,
    uint8 treatmentType,
    uint32 duration
) external onlyAuthorizedTherapist {
    // Encrypt sensitive data
    euint8 encryptedProgress = FHE.asEuint8(progressScore);
    euint8 encryptedType = FHE.asEuint8(treatmentType);
    euint32 encryptedDuration = FHE.asEuint32(duration);

    // Store encrypted session data
    sessions[sessionId] = TreatmentSession({
        encryptedPatientId: patients[patientAddress].encryptedPatientId,
        encryptedProgressScore: encryptedProgress,
        encryptedTreatmentType: encryptedType,
        encryptedDuration: encryptedDuration,
        timestamp: block.timestamp,
        therapist: msg.sender
    });
}
```

#### Use Cases

1. **Healthcare Privacy:** Protect patient medical records on blockchain
2. **Rehabilitation Tracking:** Monitor treatment progress confidentially
3. **Multi-Provider Care:** Enable coordinated care with privacy
4. **Compliance Monitoring:** Track compliance without revealing personal data
5. **Audit Trails:** Transparent operations with data confidentiality

#### Getting Started

```bash
# Generate standalone repository
npm run create-example privacy-rehabilitation-record ./my-app

# Navigate to generated project
cd my-app

# Install and test
npm install
npm run compile
npm run test

# Deploy
npm run deploy
```

#### Documentation

- [Full Documentation](DOCUMENTATION.md)
- [Contract Source](contracts/PrivacyRehabilitationRecord.sol)
- [Test Suite](test/PrivacyRehabilitationRecord.test.ts)
- [Developer Guide](DEVELOPER_GUIDE.md)

#### Real-World Applications

- **Rehabilitation Centers:** Track patient progress privately
- **Telemedicine:** Remote treatment monitoring
- **Insurance Verification:** Prove treatment without exposing details
- **Clinical Research:** Aggregate data analysis with privacy
- **Multi-Specialty Clinics:** Coordinated care across providers

#### Learning Objectives

After studying this example, you will understand:
- ✅ How to encrypt different data types (uint8, uint32)
- ✅ Proper access control patterns with FHE
- ✅ Role-based permission systems
- ✅ Healthcare-specific privacy requirements
- ✅ Event-driven audit trails
- ✅ Multi-user encrypted applications
- ✅ Testing encrypted contracts
- ✅ Production-quality code standards

---

## Example Generation

### Using Automation Tools

Generate any example as a standalone repository:

```bash
# List available examples
npm run help:examples

# Generate specific example
npm run create-example privacy-rehabilitation-record ./output

# The generated repository includes:
# ✓ Complete contract code
# ✓ Comprehensive tests
# ✓ Deployment scripts
# ✓ Configuration files
# ✓ Documentation
# ✓ Frontend (if applicable)
```

### Generated Repository Structure

```
generated-example/
├── contracts/
│   └── [ExampleContract].sol
├── test/
│   └── [ExampleContract].test.ts
├── scripts/
│   └── deploy.js
├── deploy/
│   └── deploy.ts
├── tasks/
│   └── accounts.ts
├── hardhat.config.ts
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

## Example Categories

### Healthcare & Privacy

**Examples:**
- Privacy Rehabilitation Record (✅ Available)

**Concepts:**
- Patient data encryption
- Medical record confidentiality
- HIPAA/GDPR compliance patterns
- Multi-provider access control

### Financial Applications

**Potential Examples:**
- Confidential voting systems
- Private auctions
- Encrypted balance tracking
- Secret salary systems

**Concepts:**
- Private transactions
- Encrypted balances
- Confidential bids
- Sealed voting

### Gaming & Entertainment

**Potential Examples:**
- Private game state
- Encrypted leaderboards
- Hidden information games
- Confidential rewards

**Concepts:**
- Hidden state management
- Fair gameplay mechanics
- Private scoring
- Encrypted randomness

### Access Control & Identity

**Potential Examples:**
- Private KYC verification
- Encrypted credentials
- Confidential membership
- Hidden attribute proofs

**Concepts:**
- Zero-knowledge proofs
- Private verification
- Encrypted attributes
- Anonymous authentication

## Development Workflow

### 1. Explore Examples

```bash
# Clone repository
git clone <repository-url>
cd PrivacyRehabilitationRecord

# Install dependencies
npm install

# Explore existing examples
ls contracts/
ls test/
```

### 2. Study Implementation

- Read contract source code
- Review comprehensive tests
- Understand access control patterns
- Learn FHE best practices

### 3. Generate Standalone Version

```bash
# Create your own instance
npm run create-example privacy-rehabilitation-record ./my-version

cd my-version
npm install
npm test
```

### 4. Customize

- Modify contract for your use case
- Update tests accordingly
- Adjust access control as needed
- Deploy to your network

## Testing Examples

### Run All Tests

```bash
# In main repository
npm test

# In generated repository
cd my-example
npm test
```

### Coverage Reports

```bash
npm run test:coverage
```

### Test on Sepolia

```bash
# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Deploy and test
npm run deploy
```

## Documentation

Each example includes:

- ✅ **NatSpec Comments:** Inline contract documentation
- ✅ **TSDoc Comments:** Test documentation
- ✅ **README:** Quick start guide
- ✅ **Architecture Diagrams:** Visual system overview
- ✅ **Security Considerations:** Best practices and warnings
- ✅ **Use Cases:** Real-world applications
- ✅ **Code Examples:** Usage patterns

## Contributing New Examples

Want to add a new example? See [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md#adding-new-examples)

### Requirements for New Examples

1. **Contract Quality**
   - Clean, well-documented Solidity code
   - Proper NatSpec comments
   - Best practices followed
   - Security considerations addressed

2. **Test Coverage**
   - Comprehensive test suite
   - TSDoc-documented tests
   - Edge cases covered
   - Access control verified

3. **Documentation**
   - Clear README
   - Architecture explanation
   - Use case description
   - Learning objectives

4. **Automation Integration**
   - Added to EXAMPLES_MAP
   - Generator tested
   - Standalone build verified

## Resources

### FHEVM Learning

- [Zama Documentation](https://docs.zama.ai)
- [FHEVM Developer Guide](https://docs.fhevm.zama.ai)
- [Solidity with FHE](https://docs.zama.ai/fhevm/solidity-library)

### Community

- [Zama Discord](https://discord.com/invite/zama)
- [Community Forum](https://www.zama.ai/community)
- [GitHub Discussions](https://github.com/zama-ai/fhevm/discussions)

### Related Projects

- [FHEVM Solidity Library](https://github.com/zama-ai/fhevm)
- [Hardhat FHEVM Plugin](https://github.com/zama-ai/fhevm-hardhat-plugin)
- [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)

## Roadmap

### Planned Examples

- [ ] Confidential Voting System
- [ ] Private Auction Platform
- [ ] Encrypted Token Standard (ERC7984)
- [ ] Secret Salary Payment System
- [ ] Private Credit Scoring
- [ ] Confidential Supply Chain
- [ ] Hidden NFT Attributes
- [ ] Encrypted Gaming State

### Enhancements

- [ ] Category-based generation (generate all healthcare examples)
- [ ] Interactive CLI with prompts
- [ ] Video tutorials for each example
- [ ] Deployment automation
- [ ] Frontend templates
- [ ] Testing utilities library

## License

BSD-3-Clause-Clear License - See LICENSE file

---

**Zama Bounty Track December 2025: Build The FHEVM Example Hub**

**Current Examples:** 1 production-ready
**Total Test Cases:** 40+
**Documentation:** Comprehensive
**Status:** ✅ Ready for expansion
