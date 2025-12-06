# Video Demonstration Script
## Privacy-Preserving Rehabilitation Treatment Tracker
### Duration: 60 seconds

---

## Scene 1: Opening (0-8 seconds)
**Visual**: Project title card with logo and tagline
**Action**:
- Display project name: "Privacy-Preserving Rehabilitation Treatment Tracker"
- Show subtitle: "Powered by Zama FHEVM"
- Display badges: MIT License, Solidity 0.8.24, FHEVM

**Narration**:
Welcome to the Privacy-Preserving Rehabilitation Treatment Tracker - a blockchain solution that keeps medical data completely confidential using Fully Homomorphic Encryption.

---

## Scene 2: Problem Statement (8-15 seconds)
**Visual**: Split-screen animation
- Left: Traditional system with exposed data
- Right: Our encrypted system with locked data

**Action**:
- Animate traditional healthcare system with visible patient data
- Transition to encrypted system with shield icons
- Highlight privacy concerns

**Narration**:
Healthcare providers need to track patient rehabilitation progress, but traditional systems expose sensitive medical data. Our solution encrypts everything on-chain while enabling authorized access.

---

## Scene 3: Architecture Overview (15-25 seconds)
**Visual**: System architecture diagram
**Action**:
- Display smart contract structure
- Highlight three roles: Admin, Therapist, Patient
- Show data flow with encryption symbols
- Zoom into key data types: euint32, euint8

**Code Display**:
```solidity
euint32 encryptedPatientId
euint8 encryptedProgressScore
euint8 encryptedTreatmentType
euint32 encryptedDuration
```

**Narration**:
The system has three roles: Admins manage authorizations, Therapists record encrypted sessions, and Patients access their own data. All sensitive information - patient IDs, progress scores, and treatment details - are encrypted using FHE encrypted types.

---

## Scene 4: Live Demo - Patient Registration (25-32 seconds)
**Visual**: Screen recording of frontend interface
**Action**:
1. Connect MetaMask wallet
2. Click "Register as Patient"
3. Enter patient ID: 123456
4. Show transaction confirmation
5. Display success message

**On-Screen Text**:
- "Step 1: Patient Registration"
- "Patient ID encrypted with FHE.asEuint32()"
- "Transaction confirmed"

**Narration**:
Let's see it in action. First, a patient registers with their unique ID, which is immediately encrypted using FHE before storing on-chain.

---

## Scene 5: Live Demo - Therapist Recording Session (32-43 seconds)
**Visual**: Screen recording showing therapist interface
**Action**:
1. Switch to authorized therapist account
2. Select patient address
3. Fill in session details:
   - Progress Score: 75
   - Treatment Type: Physical Therapy
   - Duration: 60 minutes
4. Click "Record Session"
5. Show event emission: SessionRecorded

**On-Screen Text**:
- "Step 2: Record Treatment Session"
- "All data encrypted before storage"
- "Progress: 75/100 → encrypted"
- "Session recorded successfully"

**Narration**:
An authorized therapist records a treatment session. The progress score, treatment type, and duration are all encrypted individually, ensuring complete confidentiality while maintaining functionality.

---

## Scene 6: FHEVM Features Highlight (43-50 seconds)
**Visual**: Code snippets with animations
**Action**:
- Show FHE.allow() function calls
- Highlight access control modifiers
- Display event logs

**Code Display**:
```solidity
// Encryption
euint8 encrypted = FHE.asEuint8(score);

// Access Control
FHE.allowThis(encrypted);
FHE.allow(encrypted, patientAddress);

// Role-Based Security
modifier onlyAuthorizedTherapist()
```

**Narration**:
Key FHEVM concepts demonstrated: encrypted data types, FHE.allow for access control, and role-based permissions ensuring only authorized parties can decrypt specific data.

---

## Scene 7: Test Results (50-55 seconds)
**Visual**: Terminal showing test execution
**Action**:
- Run `npm test` command
- Show test results scrolling:
  - ✓ 40+ passing tests
  - Test coverage report
  - All categories passing

**On-Screen Text**:
- "40+ Comprehensive Tests"
- "Full Coverage: Encryption, Access Control, Validation"
- "All Tests Passing ✓"

**Narration**:
The project includes over forty comprehensive tests covering encryption, access control, input validation, and all contract functions.

---

## Scene 8: Closing (55-60 seconds)
**Visual**: Summary slide with key points
**Action**:
- Display feature list with checkmarks
- Show GitHub repository link
- Display Zama bounty logo
- End with project tagline

**On-Screen Text**:
✓ Fully Encrypted Medical Data
✓ Role-Based Access Control
✓ 40+ Test Cases
✓ Production-Ready Code
✓ Comprehensive Documentation

GitHub: [Repository Link]
Built for: Zama Bounty December 2025

**Narration**:
This production-ready implementation demonstrates real-world FHE usage in healthcare, with comprehensive testing and documentation. Thank you for watching!

**End Screen**:
"Privacy-Preserving Rehabilitation Treatment Tracker
Advancing Healthcare Privacy Through Blockchain Innovation
Powered by Zama FHEVM"

---

## Technical Notes for Video Production

### Recording Requirements
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 or 60 fps
- **Format**: MP4 (H.264 codec)
- **Audio**: Clear narration, no background music to avoid distraction
- **Captions**: Include subtitles for accessibility

### Software Recommendations
- **Screen Recording**: OBS Studio, Camtasia, or ScreenFlow
- **Video Editing**: DaVinci Resolve, Adobe Premiere, or Final Cut Pro
- **Animation**: After Effects for graphic elements
- **Code Highlighting**: Use VS Code with high-contrast theme

### Visual Guidelines
- Use high contrast for code snippets
- Zoom into important UI elements
- Smooth transitions between scenes
- Highlight key actions with arrows or circles
- Keep text on screen long enough to read (3-4 seconds minimum)

### Timing Breakdown
- Introduction: 8 seconds
- Problem Statement: 7 seconds
- Architecture: 10 seconds
- Patient Demo: 7 seconds
- Therapist Demo: 11 seconds
- FHEVM Features: 7 seconds
- Test Results: 5 seconds
- Closing: 5 seconds
**Total**: 60 seconds

### Preparation Checklist
- [ ] Local environment set up and working
- [ ] Contract deployed to testnet
- [ ] Frontend fully functional
- [ ] Test accounts prepared (admin, therapist, patient)
- [ ] Sample data ready
- [ ] Network connection stable
- [ ] Recording software tested
- [ ] Audio equipment tested
- [ ] Script practiced for timing

---

## Alternative 30-Second Version (Optional)

If a shorter version is needed:

**0-5s**: Introduction and problem statement
**5-15s**: Live demo of patient registration and session recording
**15-25s**: FHEVM features highlight with code snippets
**25-30s**: Test results and closing

---

## Narration Tone Guidelines
- Professional but accessible
- Enthusiastic about privacy technology
- Clear pronunciation of technical terms
- Moderate pace - not too fast
- Emphasis on key phrases: "encrypted", "confidential", "privacy-preserving"
- Avoid jargon unless necessary
- Sound confident and knowledgeable
