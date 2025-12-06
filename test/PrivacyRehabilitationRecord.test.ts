import { expect } from "chai";
import { ethers } from "hardhat";
import { PrivacyRehabilitationRecord } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

/**
 * @title Privacy Rehabilitation Record Tests
 * @chapter access-control
 * @chapter encryption
 * @chapter user-decryption
 *
 * @description
 * This test suite demonstrates the implementation of a confidential rehabilitation
 * tracking system using Fully Homomorphic Encryption (FHE). The contract allows
 * patients to register with encrypted IDs, therapists to record encrypted treatment
 * sessions, and administrators to manage access control.
 *
 * Key FHEVM concepts demonstrated:
 * - Encrypted data storage (euint8, euint32)
 * - Access control with FHE.allow() and FHE.allowThis()
 * - Role-based permissions (admin, therapist, patient)
 * - Encrypted progress tracking and reporting
 */
describe("Privacy Rehabilitation Record", function () {
  let contract: PrivacyRehabilitationRecord;
  let admin: SignerWithAddress;
  let therapist: SignerWithAddress;
  let patient1: SignerWithAddress;
  let patient2: SignerWithAddress;
  let unauthorized: SignerWithAddress;

  /**
   * @function beforeEach
   * @description Deploy a fresh contract instance before each test
   *
   * This ensures test isolation and prevents state leakage between tests.
   * The deploying account automatically becomes the admin.
   */
  beforeEach(async function () {
    [admin, therapist, patient1, patient2, unauthorized] = await ethers.getSigners();

    const PrivacyRehabilitationRecordFactory = await ethers.getContractFactory(
      "PrivacyRehabilitationRecord"
    );
    contract = await PrivacyRehabilitationRecordFactory.deploy();
    await contract.waitForDeployment();
  });

  /**
   * @section Deployment Tests
   * @description Verify correct contract initialization
   */
  describe("Deployment", function () {
    /**
     * @test Should set the correct admin
     * @description Verifies that the deploying address is set as the admin
     */
    it("Should set the correct admin", async function () {
      expect(await contract.admin()).to.equal(admin.address);
    });

    /**
     * @test Should initialize counters to zero
     * @description Ensures totalPatients and currentSessionId start at correct values
     */
    it("Should initialize counters correctly", async function () {
      expect(await contract.totalPatients()).to.equal(0);
      expect(await contract.currentSessionId()).to.equal(1);
    });
  });

  /**
   * @section Patient Registration Tests
   * @chapter encryption
   * @description Tests for patient registration with encrypted patient IDs
   *
   * Demonstrates:
   * - Encrypting uint32 patient IDs using FHE.asEuint32()
   * - Setting up access permissions with FHE.allowThis() and FHE.allow()
   * - Event emission for patient registration
   */
  describe("Patient Registration", function () {
    const patientId = 12345;

    /**
     * @test Should register a patient successfully
     * @description Verifies that a new patient can register with an encrypted ID
     *
     * This test demonstrates:
     * - Creating encrypted patient IDs
     * - Proper event emission
     * - State updates (totalPatients increment)
     */
    it("Should register a patient successfully", async function () {
      await expect(contract.connect(patient1).registerPatient(patientId))
        .to.emit(contract, "PatientRegistered")
        .withArgs(patient1.address, await ethers.provider.getBlock('latest').then(b => b!.timestamp + 1));

      expect(await contract.totalPatients()).to.equal(1);
    });

    /**
     * @test Should prevent duplicate registration
     * @description Ensures a patient cannot register twice
     *
     * Anti-pattern: This prevents data corruption from multiple registrations
     */
    it("Should prevent duplicate registration", async function () {
      await contract.connect(patient1).registerPatient(patientId);

      await expect(
        contract.connect(patient1).registerPatient(patientId)
      ).to.be.revertedWith("Patient already registered");
    });

    /**
     * @test Should store patient information correctly
     * @description Verifies that patient data is correctly stored and retrievable
     */
    it("Should store patient information correctly", async function () {
      await contract.connect(patient1).registerPatient(patientId);

      const patientInfo = await contract.connect(patient1).getPatientInfo(patient1.address);
      expect(patientInfo.isRegistered).to.be.true;
      expect(patientInfo.totalSessions).to.equal(0);
    });

    /**
     * @test Should allow multiple patients to register
     * @description Verifies the system can handle multiple patient registrations
     */
    it("Should allow multiple patients to register", async function () {
      await contract.connect(patient1).registerPatient(12345);
      await contract.connect(patient2).registerPatient(67890);

      expect(await contract.totalPatients()).to.equal(2);
    });
  });

  /**
   * @section Therapist Authorization Tests
   * @chapter access-control
   * @description Tests for therapist authorization and access control
   *
   * Demonstrates:
   * - Role-based access control (onlyAdmin modifier)
   * - Authorization management
   * - Access revocation
   */
  describe("Therapist Authorization", function () {
    /**
     * @test Admin should authorize therapists
     * @description Verifies that the admin can grant therapist permissions
     *
     * Access control pattern: Only admin can authorize therapists
     */
    it("Should allow admin to authorize therapist", async function () {
      await expect(contract.connect(admin).authorizeTherapist(therapist.address))
        .to.emit(contract, "TherapistAuthorized")
        .withArgs(therapist.address, admin.address);

      expect(await contract.isAuthorizedTherapist(therapist.address)).to.be.true;
    });

    /**
     * @test Should prevent non-admin authorization
     * @description Ensures only admin can authorize therapists
     *
     * Security: This prevents unauthorized access escalation
     */
    it("Should prevent non-admin from authorizing therapist", async function () {
      await expect(
        contract.connect(unauthorized).authorizeTherapist(therapist.address)
      ).to.be.revertedWith("Not authorized admin");
    });

    /**
     * @test Should prevent duplicate authorization
     * @description Ensures therapist cannot be authorized twice
     */
    it("Should prevent duplicate authorization", async function () {
      await contract.connect(admin).authorizeTherapist(therapist.address);

      await expect(
        contract.connect(admin).authorizeTherapist(therapist.address)
      ).to.be.revertedWith("Therapist already authorized");
    });

    /**
     * @test Admin should revoke therapist access
     * @description Verifies that admin can revoke therapist permissions
     */
    it("Should allow admin to revoke therapist", async function () {
      await contract.connect(admin).authorizeTherapist(therapist.address);

      await expect(contract.connect(admin).revokeTherapist(therapist.address))
        .to.emit(contract, "TherapistRevoked")
        .withArgs(therapist.address, admin.address);

      expect(await contract.isAuthorizedTherapist(therapist.address)).to.be.false;
    });

    /**
     * @test Should fail to revoke unauthorized therapist
     * @description Ensures cannot revoke non-authorized therapist
     */
    it("Should fail to revoke non-authorized therapist", async function () {
      await expect(
        contract.connect(admin).revokeTherapist(therapist.address)
      ).to.be.revertedWith("Therapist not authorized");
    });
  });

  /**
   * @section Treatment Session Recording Tests
   * @chapter encryption
   * @description Tests for recording encrypted treatment sessions
   *
   * Demonstrates:
   * - Encrypting multiple data types (euint8, euint32)
   * - Complex access control (therapist-only operations)
   * - Managing encrypted session data
   */
  describe("Treatment Session Recording", function () {
    const patientId = 12345;
    const progressScore = 75;
    const treatmentType = 1; // Physical Therapy
    const duration = 60; // minutes

    beforeEach(async function () {
      // Setup: Register patient and authorize therapist
      await contract.connect(patient1).registerPatient(patientId);
      await contract.connect(admin).authorizeTherapist(therapist.address);
    });

    /**
     * @test Should record treatment session successfully
     * @description Verifies therapist can record encrypted treatment sessions
     *
     * Demonstrates:
     * - Encrypting progress scores (euint8)
     * - Encrypting treatment types (euint8)
     * - Encrypting duration (euint32)
     * - Proper permission setup with FHE.allow()
     */
    it("Should record treatment session successfully", async function () {
      await expect(
        contract.connect(therapist).recordTreatmentSession(
          patient1.address,
          progressScore,
          treatmentType,
          duration
        )
      )
        .to.emit(contract, "SessionRecorded")
        .withArgs(1, patient1.address, therapist.address);

      const patientInfo = await contract.connect(patient1).getPatientInfo(patient1.address);
      expect(patientInfo.totalSessions).to.equal(1);
    });

    /**
     * @test Should prevent unauthorized session recording
     * @description Ensures only authorized therapists can record sessions
     *
     * Security: Prevents unauthorized data manipulation
     */
    it("Should prevent unauthorized session recording", async function () {
      await expect(
        contract.connect(unauthorized).recordTreatmentSession(
          patient1.address,
          progressScore,
          treatmentType,
          duration
        )
      ).to.be.revertedWith("Not authorized therapist");
    });

    /**
     * @test Should validate progress score range
     * @description Ensures progress scores are within valid range (0-100)
     *
     * Input validation: Prevents invalid data entry
     */
    it("Should reject invalid progress score", async function () {
      await expect(
        contract.connect(therapist).recordTreatmentSession(
          patient1.address,
          101, // Invalid score > 100
          treatmentType,
          duration
        )
      ).to.be.revertedWith("Progress score must be 0-100");
    });

    /**
     * @test Should validate session duration
     * @description Ensures session duration is greater than zero
     */
    it("Should reject zero duration", async function () {
      await expect(
        contract.connect(therapist).recordTreatmentSession(
          patient1.address,
          progressScore,
          treatmentType,
          0 // Invalid duration
        )
      ).to.be.revertedWith("Duration must be greater than 0");
    });

    /**
     * @test Should fail for unregistered patient
     * @description Ensures cannot record sessions for unregistered patients
     */
    it("Should fail for unregistered patient", async function () {
      await expect(
        contract.connect(therapist).recordTreatmentSession(
          patient2.address, // Not registered
          progressScore,
          treatmentType,
          duration
        )
      ).to.be.revertedWith("Patient not registered");
    });

    /**
     * @test Should record multiple sessions
     * @description Verifies system can handle multiple treatment sessions
     */
    it("Should record multiple sessions", async function () {
      await contract.connect(therapist).recordTreatmentSession(
        patient1.address,
        progressScore,
        treatmentType,
        duration
      );

      await contract.connect(therapist).recordTreatmentSession(
        patient1.address,
        80,
        2, // Different treatment type
        45
      );

      const patientInfo = await contract.connect(patient1).getPatientInfo(patient1.address);
      expect(patientInfo.totalSessions).to.equal(2);
    });

    /**
     * @test Should increment session ID correctly
     * @description Verifies session IDs are sequential and unique
     */
    it("Should increment session ID correctly", async function () {
      await contract.connect(therapist).recordTreatmentSession(
        patient1.address,
        progressScore,
        treatmentType,
        duration
      );

      expect(await contract.currentSessionId()).to.equal(2);

      await contract.connect(therapist).recordTreatmentSession(
        patient1.address,
        progressScore,
        treatmentType,
        duration
      );

      expect(await contract.currentSessionId()).to.equal(3);
    });
  });

  /**
   * @section Progress Report Tests
   * @chapter encryption
   * @description Tests for generating encrypted progress reports
   *
   * Demonstrates:
   * - Aggregating encrypted treatment data
   * - Generating compliance metrics
   * - Secure report generation
   */
  describe("Progress Report Generation", function () {
    const patientId = 12345;
    const overallProgress = 85;
    const complianceRate = 90;

    beforeEach(async function () {
      await contract.connect(patient1).registerPatient(patientId);
      await contract.connect(admin).authorizeTherapist(therapist.address);
    });

    /**
     * @test Should generate progress report
     * @description Verifies therapist can create encrypted progress reports
     *
     * Demonstrates:
     * - Encrypting progress metrics
     * - Updating report timestamps
     * - Access permission management
     */
    it("Should generate progress report successfully", async function () {
      await expect(
        contract.connect(therapist).generateProgressReport(
          patient1.address,
          overallProgress,
          complianceRate
        )
      )
        .to.emit(contract, "ProgressUpdated")
        .withArgs(patient1.address, await ethers.provider.getBlock('latest').then(b => b!.timestamp + 1));

      const reportStatus = await contract.connect(patient1).getProgressReportStatus(patient1.address);
      expect(reportStatus.reportGenerated).to.be.true;
    });

    /**
     * @test Should prevent unauthorized report generation
     * @description Ensures only authorized therapists can generate reports
     */
    it("Should prevent unauthorized report generation", async function () {
      await expect(
        contract.connect(unauthorized).generateProgressReport(
          patient1.address,
          overallProgress,
          complianceRate
        )
      ).to.be.revertedWith("Not authorized therapist");
    });

    /**
     * @test Should validate progress values
     * @description Ensures progress values are within range (0-100)
     */
    it("Should reject invalid progress values", async function () {
      await expect(
        contract.connect(therapist).generateProgressReport(
          patient1.address,
          101, // Invalid
          complianceRate
        )
      ).to.be.revertedWith("Overall progress must be 0-100");
    });

    /**
     * @test Should validate compliance rate
     * @description Ensures compliance rate is within range (0-100)
     */
    it("Should reject invalid compliance rate", async function () {
      await expect(
        contract.connect(therapist).generateProgressReport(
          patient1.address,
          overallProgress,
          101 // Invalid
        )
      ).to.be.revertedWith("Compliance rate must be 0-100");
    });
  });

  /**
   * @section Access Control Tests
   * @chapter access-control
   * @description Tests for data access permissions
   *
   * Demonstrates:
   * - Patient data privacy
   * - Therapist access rights
   * - Unauthorized access prevention
   */
  describe("Access Control", function () {
    const patientId = 12345;

    beforeEach(async function () {
      await contract.connect(patient1).registerPatient(patientId);
      await contract.connect(admin).authorizeTherapist(therapist.address);
    });

    /**
     * @test Patient should access own data
     * @description Verifies patients can view their own information
     */
    it("Should allow patient to access own data", async function () {
      const patientInfo = await contract.connect(patient1).getPatientInfo(patient1.address);
      expect(patientInfo.isRegistered).to.be.true;
    });

    /**
     * @test Therapist should access patient data
     * @description Verifies authorized therapists can access patient information
     */
    it("Should allow therapist to access patient data", async function () {
      const patientInfo = await contract.connect(therapist).getPatientInfo(patient1.address);
      expect(patientInfo.isRegistered).to.be.true;
    });

    /**
     * @test Should prevent unauthorized data access
     * @description Ensures unauthorized users cannot access patient data
     *
     * Privacy: Critical for maintaining confidentiality
     */
    it("Should prevent unauthorized data access", async function () {
      await expect(
        contract.connect(unauthorized).getPatientInfo(patient1.address)
      ).to.be.revertedWith("Not authorized to access patient data");
    });
  });

  /**
   * @section Contract Statistics Tests
   * @description Tests for system-wide statistics and metrics
   */
  describe("Contract Statistics", function () {
    /**
     * @test Should return correct statistics
     * @description Verifies contract statistics are accurate
     */
    it("Should return correct statistics", async function () {
      await contract.connect(patient1).registerPatient(12345);
      await contract.connect(patient2).registerPatient(67890);
      await contract.connect(admin).authorizeTherapist(therapist.address);

      await contract.connect(therapist).recordTreatmentSession(
        patient1.address,
        75,
        1,
        60
      );

      const stats = await contract.getContractStats();
      expect(stats.totalRegisteredPatients).to.equal(2);
      expect(stats.totalRecordedSessions).to.equal(1);
    });
  });

  /**
   * @section Admin Management Tests
   * @chapter access-control
   * @description Tests for administrative functions
   */
  describe("Admin Management", function () {
    /**
     * @test Should update admin
     * @description Verifies admin can transfer admin rights
     */
    it("Should allow admin to update admin address", async function () {
      await contract.connect(admin).updateAdmin(therapist.address);
      expect(await contract.admin()).to.equal(therapist.address);
    });

    /**
     * @test Should prevent non-admin from updating admin
     * @description Ensures only current admin can transfer rights
     */
    it("Should prevent non-admin from updating admin", async function () {
      await expect(
        contract.connect(unauthorized).updateAdmin(unauthorized.address)
      ).to.be.revertedWith("Not authorized admin");
    });

    /**
     * @test Should reject zero address
     * @description Ensures admin cannot be set to zero address
     */
    it("Should reject zero address as admin", async function () {
      await expect(
        contract.connect(admin).updateAdmin(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid admin address");
    });
  });
});
