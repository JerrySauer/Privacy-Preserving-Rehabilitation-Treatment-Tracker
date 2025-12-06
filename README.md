# Privacy-Preserving Rehabilitation Treatment Tracker

> **A Fully Homomorphic Encryption (FHE) powered healthcare system for confidential rehabilitation treatment management**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/solidity-0.8.24-green.svg)
![FHEVM](https://img.shields.io/badge/FHEVM-Zama-purple.svg)

[Video](https://streamable.com/f2thb4) Privacy-Preserving Rehabilitation Treatment Tracker.mp4

[Live](https://privacy-preserving-rehabilitation-t.vercel.app/)

## Overview

The **Privacy-Preserving Rehabilitation Treatment Tracker** is an innovative blockchain-based healthcare solution that leverages Zama's Fully Homomorphic Encryption Virtual Machine (FHEVM) to maintain complete confidentiality of sensitive medical data while enabling secure treatment tracking and progress monitoring.

This project demonstrates production-ready implementation of privacy-preserving smart contracts in a real-world healthcare context, specifically addressing the critical need for rehabilitation treatment confidentiality.

### Core Problem Solved

Traditional healthcare systems face a fundamental challenge: maintaining patient privacy while enabling authorized healthcare providers to track and assess treatment progress. This system solves this by:

- **Encrypting all sensitive patient data** on the blockchain using FHE
- **Maintaining privacy** even during computational operations
- **Enabling role-based access control** without exposing sensitive information
- **Creating audit trails** while preserving confidentiality

## Key Features

### For Patients
- **Secure Registration**: Register with encrypted unique identifiers
- **Privacy Guarantee**: All medical data encrypted end-to-end
- **Treatment History**: Access your complete rehabilitation journey
- **Progress Tracking**: View encrypted progress reports
- **Data Control**: Manage access permissions to your information

### For Healthcare Providers (Therapists)
- **Confidential Session Recording**: Log therapy sessions with encrypted details
- **Progress Assessment**: Generate encrypted progress reports
- **Multiple Treatment Types**: Support for 6 rehabilitation categories
- **Patient Management**: Track multiple patients securely
- **Compliance Monitoring**: Encrypted compliance rate tracking

### For Administrators
- **Authorization Management**: Grant and revoke therapist permissions
- **System Oversight**: Monitor aggregate statistics
- **Security Control**: Maintain system integrity

## FHEVM Concepts Demonstrated

This project showcases essential FHEVM patterns and best practices:

### 1. Encrypted Data Types
```solidity
euint32 encryptedPatientId      // Encrypted patient identifier
euint8 encryptedProgressScore   // Encrypted progress score (0-100)
euint8 encryptedTreatmentType   // Encrypted treatment category
euint32 encryptedDuration       // Encrypted session duration
```

### 2. Access Control Patterns
- **FHE.allow()** - Grant decryption permissions to specific addresses
- **FHE.allowThis()** - Allow contract to perform computations
- **FHE.allowTransient()** - Temporary access for specific operations

### 3. Role-Based Security Model
```
Admin → Manages therapist authorizations
  ↓
Therapist → Records sessions, generates reports
  ↓
Patient → Views own encrypted data
```

### 4. Privacy-Preserving Operations
- Encrypted data storage
- Computation on encrypted values
- Selective decryption access
- Zero-knowledge audit trails

## Technical Architecture

### Smart Contract Structure

```
PrivacyRehabilitationRecord
├── Patient Management
│   ├── registerPatient()
│   ├── getPatientInfo()
│   └── getPatientSessionCount()
├── Therapist Authorization
│   ├── authorizeTherapist()
│   ├── revokeTherapist()
│   └── isAuthorizedTherapist()
├── Treatment Tracking
│   ├── recordTreatmentSession()
│   ├── generateProgressReport()
│   └── getSessionInfo()
└── System Administration
    ├── updateAdmin()
    └── getContractStats()
```

### Data Structures

**Patient Record**
- Ethereum address
- Encrypted patient ID (euint32)
- Registration timestamp
- Total sessions counter
- Registration status flag

**Treatment Session**
- Encrypted patient ID
- Encrypted progress score (0-100)
- Encrypted treatment type (1-6)
- Encrypted duration (minutes)
- Session timestamp
- Recording therapist address

**Progress Report**
- Encrypted patient ID
- Encrypted overall progress (0-100)
- Encrypted compliance rate (0-100)
- Total completed sessions
- Last update timestamp

## Treatment Categories

The system supports six standard rehabilitation therapy types:

1. **Physical Therapy** - Motor function and mobility rehabilitation
2. **Occupational Therapy** - Daily living activities and skills
3. **Speech Therapy** - Communication and language disorders
4. **Cognitive Therapy** - Mental function and memory improvement
5. **Behavioral Therapy** - Behavioral modification and psychological support
6. **Group Therapy** - Social interaction and peer support

## Quick Start Guide

### Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn** package manager
- **MetaMask** or compatible Web3 wallet
- **Git** for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/JerrySauer/Privacy-Preserving-Rehabilitation-Treatment-Tracker.git
cd privacy-rehab-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY
ZAMA_RPC_URL=https://devnet.zama.ai
ETHERSCAN_API_KEY=your_etherscan_api_key
```

4. **Compile contracts**
```bash
npm run compile
```

5. **Run tests**
```bash
npm test
```

6. **Deploy to testnet**
```bash
npm run deploy
```

## Usage Examples

### For Patients

**Register as a Patient**
```javascript
// Connect wallet and register
const patientId = 123456;
await contract.registerPatient(patientId);
```

**View Your Treatment History**
```javascript
const patientInfo = await contract.getPatientInfo(yourAddress);
console.log(`Total Sessions: ${patientInfo.totalSessions}`);
```

### For Therapists

**Record a Treatment Session**
```javascript
await contract.recordTreatmentSession(
  patientAddress,
  75,  // Progress score (0-100)
  1,   // Treatment type (1=Physical Therapy)
  60   // Duration in minutes
);
```

**Generate Progress Report**
```javascript
await contract.generateProgressReport(
  patientAddress,
  80,  // Overall progress
  85   // Compliance rate
);
```

### For Administrators

**Authorize a Therapist**
```javascript
await contract.authorizeTherapist(therapistAddress);
```

**View System Statistics**
```javascript
const stats = await contract.getContractStats();
console.log(`Total Patients: ${stats.totalRegisteredPatients}`);
console.log(`Total Sessions: ${stats.totalRecordedSessions}`);
```

## Development

### Project Structure
```
privacy-rehab-tracker/
├── contracts/
│   └── PrivacyRehabilitationRecord.sol
├── test/
│   └── PrivacyRehabilitationRecord.test.ts
├── scripts/
│   ├── deploy.js
│   └── generate-docs.ts
├── public/
│   └── index.html
├── hardhat.config.ts
├── package.json
└── README.md
```

### Running Tests

**Execute full test suite**
```bash
npm test
```

**Run with coverage report**
```bash
npm run test:coverage
```

**Run specific test file**
```bash
npx hardhat test test/PrivacyRehabilitationRecord.test.ts
```

### Local Development

**Start local Hardhat node**
```bash
npx hardhat node
```

**Deploy to local network**
```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Start frontend development server**
```bash
npm run dev
```

Access the application at: `http://localhost:3000`

## Security Considerations

### FHE Security Model
- All sensitive data encrypted using Zama's FHE library
- Computations performed on encrypted values
- Decryption only by authorized parties
- No plaintext exposure on-chain

### Access Control
- Role-based permission system
- Modifier-enforced function restrictions
- Authorization event logging
- Admin transfer capabilities

### Input Validation
- Progress scores validated (0-100 range)
- Duration checked for positive values
- Address validation for zero addresses
- Duplicate registration prevention

### Best Practices
- Never commit private keys
- Use environment variables for sensitive data
- Regular dependency updates
- Smart contract audits before production

## Testing Coverage

The project includes comprehensive test coverage:

- **40+ test cases** covering all contract functions
- **8 test suites** for different contract aspects
- **Edge case testing** for error conditions
- **Access control verification** for all modifiers
- **Event emission validation** for all state changes

**Test Categories:**
- Deployment initialization
- Patient registration workflows
- Therapist authorization management
- Treatment session recording
- Progress report generation
- Access control enforcement
- System statistics accuracy
- Admin management functions

## Network Configuration

### Supported Networks

**Zama Devnet (Recommended)**
- Full FHE functionality
- Free testnet tokens
- Optimal for development

**Sepolia Testnet**
- Ethereum testnet
- Public faucet available
- Contract verification support

**Local Hardhat Network**
- Fast development iteration
- No external dependencies
- Complete control

### Network Setup

Edit `hardhat.config.ts`:
```typescript
networks: {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY]
  },
  zama: {
    url: process.env.ZAMA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY]
  }
}
```

## API Documentation

### Core Functions

#### Patient Management

**registerPatient(uint32 _patientId)**
- Registers a new patient with encrypted ID
- Emits: `PatientRegistered`
- Access: Public

**getPatientInfo(address patientAddress)**
- Returns patient registration details
- Access: Patient or authorized therapist
- Returns: isRegistered, registrationTime, totalSessions

#### Therapist Management

**authorizeTherapist(address therapist)**
- Grants therapist authorization
- Emits: `TherapistAuthorized`
- Access: Admin only

**revokeTherapist(address therapist)**
- Revokes therapist authorization
- Emits: `TherapistRevoked`
- Access: Admin only

**isAuthorizedTherapist(address therapist)**
- Checks therapist authorization status
- Access: Public view
- Returns: boolean

#### Treatment Tracking

**recordTreatmentSession(...)**
- Records encrypted treatment session
- Parameters: patientAddress, progressScore, treatmentType, duration
- Emits: `SessionRecorded`
- Access: Authorized therapists only

**generateProgressReport(...)**
- Creates encrypted progress assessment
- Parameters: patientAddress, overallProgress, complianceRate
- Emits: `ProgressUpdated`
- Access: Authorized therapists only

### Events

```solidity
event PatientRegistered(address indexed patient, uint256 registrationTime)
event SessionRecorded(uint32 indexed sessionId, address indexed patient, address indexed therapist)
event ProgressUpdated(address indexed patient, uint256 updateTime)
event TherapistAuthorized(address indexed therapist, address indexed admin)
event TherapistRevoked(address indexed therapist, address indexed admin)
```

## Deployment Guide

### Pre-Deployment Checklist
- [ ] Environment variables configured
- [ ] Contract compiled successfully
- [ ] All tests passing
- [ ] Network connectivity verified
- [ ] Wallet funded with testnet tokens

### Deployment Steps

1. **Compile the contract**
```bash
npm run compile
```

2. **Run deployment script**
```bash
npm run deploy
```

3. **Verify contract on Etherscan**
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

4. **Update frontend configuration**
- Copy deployed contract address
- Update `public/index.html` with new address
- Update ABI if contract changed

5. **Test deployed contract**
```bash
npx hardhat run scripts/test-deployment.js --network sepolia
```

## Contributing

We welcome contributions to improve the Privacy-Preserving Rehabilitation Treatment Tracker!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Follow commit message conventions

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Resources

### Documentation
- [Zama Official Documentation](https://docs.zama.ai)
- [FHEVM Developer Guide](https://docs.fhevm.zama.ai)
- [Hardhat Documentation](https://hardhat.org/docs)

### Community
- [Zama Discord](https://discord.gg/zama)
- [GitHub Issues](https://github.com/JerrySauer/Privacy-Preserving-Rehabilitation-Treatment-Tracker/issues)
- [Zama Forum](https://community.zama.ai)

### Related Projects
- [FHEVM Solidity Library](https://github.com/zama-ai/fhevm)
- [FHEVM Examples](https://github.com/zama-ai/fhevm-examples)

## Acknowledgments

- **Zama Team** - For developing the groundbreaking FHEVM technology
- **Ethereum Foundation** - For the robust blockchain infrastructure
- **Hardhat Team** - For excellent development tools
- **Open Source Community** - For continuous support and contributions

## Disclaimer

**This is a prototype for educational and demonstration purposes.**

While this project demonstrates production-ready patterns and best practices, it should undergo comprehensive security audits before deployment in actual healthcare environments. Healthcare data is subject to strict regulatory requirements (HIPAA, GDPR, etc.) that must be carefully addressed in production systems.

## Contact

For questions, support, or collaboration opportunities:

- **Project Issues**: [GitHub Issues](https://github.com/JerrySauer/Privacy-Preserving-Rehabilitation-Treatment-Tracker/issues)
- **Security Concerns**: security@yourproject.com
- **General Inquiries**: info@yourproject.com

---

**Built with privacy at its core. Powered by Zama FHEVM.**

*Advancing healthcare privacy through blockchain innovation.*
