# Privacy Rehabilitation Record - FHEVM Example

## Overview

This project demonstrates a confidential rehabilitation treatment tracking system built with Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine). It showcases privacy-preserving smart contracts for healthcare applications.

## 🎯 Bounty Submission

**Zama Bounty Track:** December 2025 - Build FHEVM Example Hub

This example demonstrates:
- ✅ Automated project scaffolding
- ✅ Comprehensive test suite with TSDoc documentation
- ✅ GitBook-compatible documentation generation
- ✅ Access control patterns with FHE
- ✅ Encrypted data operations (euint8, euint32)
- ✅ Real-world use case (healthcare records)

## 🔐 Key FHEVM Concepts

### Encrypted Data Types

**euint32: Encrypted 32-bit Unsigned Integers**
- Used for: Patient IDs, session durations
- Operations: Arithmetic operations, comparisons
- Access Control: FHE.allow() for decryption permissions

**euint8: Encrypted 8-bit Unsigned Integers**
- Used for: Progress scores (0-100), treatment types (1-6)
- Operations: Range validation, encrypted updates
- Access Control: Role-based decryption

**ebool: Encrypted Boolean Values**
- Used for: Status flags, compliance indicators
- Operations: Logical operations on encrypted values
- Access Control: Selective disclosure

### Access Control Patterns

**FHE.allow() - Grant Decryption Access**
```solidity
FHE.allow(encryptedValue, userAddress);
```
- Grants a specific address permission to decrypt the value
- Required for users to read their own encrypted data
- Can be granted to multiple addresses

**FHE.allowThis() - Contract Access**
```solidity
FHE.allowThis(encryptedValue);
```
- Grants the contract itself permission to perform operations
- Required for contract to manipulate encrypted values
- Must be called before contract operations

**FHE.allowTransient() - Temporary Access**
```solidity
FHE.allowTransient(encryptedValue, userAddress);
```
- Grants temporary access for specific operations
- Automatically expires after transaction
- Useful for one-time operations

### Privacy-Preserving Features

**On-Chain Encryption**
- All sensitive patient data encrypted before storage
- Encryption happens at the application level
- Data remains encrypted throughout its lifecycle

**Selective Decryption**
- Only authorized parties can decrypt specific values
- Patients control their own data access
- Therapists have limited, role-based access

**Zero-Knowledge Operations**
- Computations performed on encrypted values
- No plaintext exposure during operations
- Results remain encrypted until authorized decryption

## 📋 Test Coverage

### Deployment Tests

#### Contract Initialization
Tests for proper contract deployment and initialization.

**Test Cases:**

- ✓ Should deploy contract successfully
  - Verifies contract deploys without errors

- ✓ Should set correct admin
  - Verifies deployer becomes admin

- ✓ Should initialize counters to zero
  - Verifies initial state is correct

### Patient Registration

#### registerPatient Function
Tests for patient registration with encrypted identifiers.

**Test Cases:**

- ✓ Should register patient successfully
  - Demonstrates: FHE.asEuint32() for encrypting patient IDs, FHE.allow() for granting access permissions

- ✓ Should prevent duplicate registration
  - Demonstrates: Input validation, duplicate prevention logic

- ✓ Should store encrypted patient ID
  - Demonstrates: Encrypted data storage, verification of encryption

- ✓ Should emit PatientRegistered event
  - Demonstrates: Event emission for audit trails

- ✓ Should allow multiple different patients
  - Demonstrates: Handling multiple registrations, unique patient tracking

### Therapist Authorization

#### authorizeTherapist Function
Tests for therapist authorization by admin.

**Test Cases:**

- ✓ Should authorize therapist (admin only)
  - Demonstrates: Admin-only access control, authorization workflow

- ✓ Should prevent non-admin from authorizing
  - Demonstrates: Access control enforcement, proper error handling

- ✓ Should prevent duplicate authorization
  - Demonstrates: State validation, duplicate prevention

- ✓ Should emit TherapistAuthorized event
  - Demonstrates: Event-driven architecture, audit logging

#### revokeTherapist Function
Tests for therapist revocation by admin.

**Test Cases:**

- ✓ Should revoke therapist authorization
  - Demonstrates: Authorization revocation, state updates

- ✓ Should prevent unauthorized revocation
  - Demonstrates: Admin-only operations, security controls

### Treatment Session Recording

#### recordTreatmentSession Function
Tests for recording encrypted treatment sessions.

**Test Cases:**

- ✓ Should record treatment session successfully
  - Demonstrates: Multiple encrypted value types (euint8, euint32), Permission setup with FHE.allow(), Data encryption and storage

- ✓ Should require authorized therapist
  - Demonstrates: Role-based access control, Function modifier enforcement

- ✓ Should require registered patient
  - Demonstrates: State validation, Prerequisite checking

- ✓ Should validate progress score (0-100)
  - Demonstrates: Input validation, Range checking for encrypted values

- ✓ Should validate duration (positive)
  - Demonstrates: Business logic validation, Boundary condition handling

- ✓ Should emit SessionRecorded event
  - Demonstrates: Event emission with indexed parameters, Audit trail creation

- ✓ Should increment session counter
  - Demonstrates: State management, Counter tracking

### Progress Report Generation

#### generateProgressReport Function
Tests for generating encrypted progress assessments.

**Test Cases:**

- ✓ Should generate progress report
  - Demonstrates: Encrypted metrics generation, Report creation workflow

- ✓ Should require authorized therapist
  - Demonstrates: Access control on report generation

- ✓ Should validate progress values
  - Demonstrates: Input validation (0-100 range), Data integrity checks

- ✓ Should emit ProgressUpdated event
  - Demonstrates: Event-driven updates, Timestamp tracking

- ✓ Should update report timestamp
  - Demonstrates: Temporal data management

### Access Control Enforcement

#### getPatientInfo Function
Tests for data access controls.

**Test Cases:**

- ✓ Should allow patient to view own data
  - Demonstrates: Self-access permissions, Data ownership model

- ✓ Should allow authorized therapist to view data
  - Demonstrates: Role-based data access, Professional access rights

- ✓ Should prevent unauthorized access
  - Demonstrates: Access denial for non-authorized users, Security enforcement

### Contract Statistics

#### getContractStats Function
Tests for aggregate statistics retrieval.

**Test Cases:**

- ✓ Should return accurate statistics
  - Demonstrates: Aggregate data computation, Public statistics (non-sensitive)

### Admin Management

#### updateAdmin Function
Tests for admin transfer functionality.

**Test Cases:**

- ✓ Should allow admin transfer
  - Demonstrates: Admin role transfer, Ownership management

- ✓ Should prevent non-admin from transfer
  - Demonstrates: Admin-only operations, Security controls

- ✓ Should prevent zero address as admin
  - Demonstrates: Input validation, Address validation

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Generate coverage report
npm run test:coverage

# Deploy to testnet
npm run deploy
```

## 📖 Documentation Structure

- `contracts/` - Solidity smart contracts with NatSpec documentation
- `test/` - Comprehensive test suite with TSDoc comments
- `scripts/` - Deployment and automation scripts
- `public/` - Frontend interface for contract interaction
- `base-template/` - Reusable Hardhat template for FHEVM

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│         Frontend (Web Interface)            │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│     PrivacyRehabilitationRecord Contract    │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │  Encrypted Patient Data (euint32)    │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │  Treatment Sessions (euint8/euint32) │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │  Access Control (FHE.allow)          │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Data Flow

1. **Patient Registration**
   - Patient provides ID (plaintext)
   - Contract encrypts ID using FHE.asEuint32()
   - Grants access to patient and contract
   - Stores encrypted ID on-chain

2. **Treatment Session Recording**
   - Therapist (authorized) provides session data
   - Contract encrypts: progress score, treatment type, duration
   - Links session to encrypted patient ID
   - Emits audit event with session details

3. **Progress Report Generation**
   - Authorized therapist creates report
   - Encrypts overall progress and compliance rate
   - Updates patient's encrypted metrics
   - Provides access to authorized parties

4. **Data Retrieval**
   - Authorized users request data
   - Contract verifies access permissions
   - Returns encrypted values
   - User decrypts with proper credentials

## 🔒 Security Considerations

### FHE Security Model

**Encryption at Rest**
- All sensitive patient data encrypted using FHE
- Encryption happens before storage on blockchain
- Keys managed through FHE permission system

**Computation on Encrypted Data**
- Arithmetic operations performed without decryption
- Results remain encrypted throughout computation
- No plaintext leakage during operations

**Decryption Access Control**
- Only addresses with FHE.allow() permission can decrypt
- Permissions granted explicitly by contract
- Can be revoked by updating permissions

### Role-Based Access Control

**Admin Role**
- Manages therapist authorizations
- Can transfer admin role
- Cannot directly access patient data
- Highest privilege level

**Therapist Role**
- Records treatment sessions
- Generates progress reports
- Views patient data for treatment
- Accountable through event logs

**Patient Role**
- Owns encrypted personal data
- Views own treatment history
- Self-manages data permissions
- Data sovereignty maintained

### Input Validation

**Range Validation**
```solidity
require(progressScore <= 100, "Score must be <= 100");
require(duration > 0, "Duration must be positive");
```

**State Validation**
```solidity
require(patients[patientAddress].isRegistered, "Patient not registered");
require(authorizedTherapists[therapist], "Not authorized");
```

**Address Validation**
```solidity
require(newAdmin != address(0), "Invalid address");
require(msg.sender == admin, "Only admin");
```

### Best Practices Implemented

1. **Always grant both permissions**
   ```solidity
   FHE.allowThis(encryptedValue);
   FHE.allow(encryptedValue, msg.sender);
   ```

2. **Validate before operations**
   - Check registration status
   - Verify authorization
   - Validate input ranges

3. **Emit events for audit**
   - All state changes emit events
   - Include relevant indexed parameters
   - Provide timestamp information

4. **Use modifiers for access control**
   - onlyAdmin for admin operations
   - onlyAuthorizedTherapist for medical functions
   - onlyPatientOrTherapist for data access

## 📊 Use Cases

### 1. Patient Registration
**Scenario:** New patient enrollment in rehabilitation program

**Workflow:**
1. Patient provides unique ID
2. System encrypts ID using FHE
3. Patient registered with encrypted identity
4. Access permissions granted to patient

**Privacy Benefit:** Patient identity protected on public blockchain

### 2. Treatment Session Recording
**Scenario:** Therapist logs rehabilitation session

**Workflow:**
1. Authorized therapist selects patient
2. Records progress score (0-100, encrypted)
3. Logs treatment type (1-6, encrypted)
4. Records session duration (encrypted)
5. System emits audit event

**Privacy Benefit:** Sensitive medical data remains encrypted

### 3. Progress Monitoring
**Scenario:** Tracking patient rehabilitation progress

**Workflow:**
1. Therapist generates progress report
2. Sets overall progress score (encrypted)
3. Records compliance rate (encrypted)
4. Report linked to patient's encrypted record

**Privacy Benefit:** Progress metrics hidden from public view

### 4. Compliance Tracking
**Scenario:** Insurance or regulatory compliance monitoring

**Workflow:**
1. System tracks session counts (public)
2. Compliance rates encrypted per patient
3. Aggregate statistics available
4. Individual details remain private

**Privacy Benefit:** Compliance proven without revealing personal data

### 5. Multi-Provider Care
**Scenario:** Patient sees multiple therapists

**Workflow:**
1. Admin authorizes additional therapists
2. Each therapist records separate sessions
3. All sessions linked to one encrypted patient ID
4. Comprehensive treatment history maintained

**Privacy Benefit:** Coordinated care with privacy preservation

## 🎓 Learning Resources

### FHEVM Documentation
- [Official Zama Docs](https://docs.zama.ai)
- [FHEVM Developer Guide](https://docs.fhevm.zama.ai)
- [Solidity Library Reference](https://docs.zama.ai/fhevm/solidity-library)

### Example Code Patterns
- Patient registration with encryption
- Role-based access control
- Treatment session recording
- Progress report generation
- Event-driven audit trails

### Testing Patterns
- Fixture-based test setup
- Access control testing
- Event emission verification
- Edge case handling
- Comprehensive coverage

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This is a bounty submission for the Zama FHEVM Example Hub. Contributions and feedback are welcome!

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Update documentation
5. Submit a pull request

### Contribution Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Follow commit message conventions

## 📞 Support

For questions or issues:
- Review [Developer Guide](DEVELOPER_GUIDE.md)
- Check [Project Structure](PROJECT_STRUCTURE.md)
- Join [Zama Discord](https://discord.com/invite/zama)
- Visit [Zama Community Forum](https://www.zama.ai/community)

---

**Built with ❤️ for the Zama FHE Ecosystem**

**Zama Bounty Track December 2025: Build The FHEVM Example Hub**
