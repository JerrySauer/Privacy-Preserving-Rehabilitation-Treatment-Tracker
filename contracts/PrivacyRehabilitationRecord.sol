// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract PrivacyRehabilitationRecord is SepoliaConfig {

    address public admin;
    uint32 public totalPatients;
    uint32 public currentSessionId;

    struct Patient {
        address patientAddress;
        euint32 encryptedPatientId;
        bool isRegistered;
        uint256 registrationTime;
        uint32 totalSessions;
    }

    struct TreatmentSession {
        euint32 encryptedPatientId;
        euint8 encryptedProgressScore; // 0-100 encrypted progress score
        euint8 encryptedTreatmentType; // Encrypted treatment type identifier
        euint32 encryptedDuration; // Session duration in minutes (encrypted)
        bool sessionCompleted;
        uint256 sessionTime;
        address authorizedTherapist;
    }

    struct ProgressReport {
        euint32 encryptedPatientId;
        euint8 encryptedOverallProgress; // Overall rehabilitation progress (0-100)
        euint8 encryptedComplianceRate; // Treatment compliance rate (0-100)
        uint32 totalCompletedSessions;
        uint256 lastUpdateTime;
        bool reportGenerated;
    }

    mapping(address => Patient) public patients;
    mapping(uint32 => TreatmentSession) public treatmentSessions;
    mapping(address => ProgressReport) public progressReports;
    mapping(address => bool) public authorizedTherapists;
    mapping(address => uint32[]) public patientSessions;

    event PatientRegistered(address indexed patient, uint256 registrationTime);
    event SessionRecorded(uint32 indexed sessionId, address indexed patient, address indexed therapist);
    event ProgressUpdated(address indexed patient, uint256 updateTime);
    event TherapistAuthorized(address indexed therapist, address indexed admin);
    event TherapistRevoked(address indexed therapist, address indexed admin);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized admin");
        _;
    }

    modifier onlyAuthorizedTherapist() {
        require(authorizedTherapists[msg.sender], "Not authorized therapist");
        _;
    }

    modifier onlyPatientOrTherapist(address patientAddress) {
        require(
            msg.sender == patientAddress || authorizedTherapists[msg.sender],
            "Not authorized to access patient data"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
        totalPatients = 0;
        currentSessionId = 1;
    }

    // Register a new patient for rehabilitation tracking
    function registerPatient(uint32 _patientId) external {
        require(!patients[msg.sender].isRegistered, "Patient already registered");

        // Encrypt patient ID for privacy
        euint32 encryptedPatientId = FHE.asEuint32(_patientId);

        patients[msg.sender] = Patient({
            patientAddress: msg.sender,
            encryptedPatientId: encryptedPatientId,
            isRegistered: true,
            registrationTime: block.timestamp,
            totalSessions: 0
        });

        // Grant access permissions
        FHE.allowThis(encryptedPatientId);
        FHE.allow(encryptedPatientId, msg.sender);

        totalPatients++;

        emit PatientRegistered(msg.sender, block.timestamp);
    }

    // Authorize a therapist to record treatment sessions
    function authorizeTherapist(address therapist) external onlyAdmin {
        require(!authorizedTherapists[therapist], "Therapist already authorized");
        authorizedTherapists[therapist] = true;

        emit TherapistAuthorized(therapist, msg.sender);
    }

    // Revoke therapist authorization
    function revokeTherapist(address therapist) external onlyAdmin {
        require(authorizedTherapists[therapist], "Therapist not authorized");
        authorizedTherapists[therapist] = false;

        emit TherapistRevoked(therapist, msg.sender);
    }

    // Record a confidential treatment session
    function recordTreatmentSession(
        address patientAddress,
        uint8 progressScore,
        uint8 treatmentType,
        uint32 duration
    ) external onlyAuthorizedTherapist {
        require(patients[patientAddress].isRegistered, "Patient not registered");
        require(progressScore <= 100, "Progress score must be 0-100");
        require(duration > 0, "Duration must be greater than 0");

        // Encrypt all sensitive session data
        euint8 encryptedProgressScore = FHE.asEuint8(progressScore);
        euint8 encryptedTreatmentType = FHE.asEuint8(treatmentType);
        euint32 encryptedDuration = FHE.asEuint32(duration);

        treatmentSessions[currentSessionId] = TreatmentSession({
            encryptedPatientId: patients[patientAddress].encryptedPatientId,
            encryptedProgressScore: encryptedProgressScore,
            encryptedTreatmentType: encryptedTreatmentType,
            encryptedDuration: encryptedDuration,
            sessionCompleted: true,
            sessionTime: block.timestamp,
            authorizedTherapist: msg.sender
        });

        // Grant necessary access permissions
        FHE.allowThis(encryptedProgressScore);
        FHE.allowThis(encryptedTreatmentType);
        FHE.allowThis(encryptedDuration);
        FHE.allow(encryptedProgressScore, patientAddress);
        FHE.allow(encryptedTreatmentType, patientAddress);
        FHE.allow(encryptedDuration, patientAddress);

        // Update patient session tracking
        patientSessions[patientAddress].push(currentSessionId);
        patients[patientAddress].totalSessions++;

        emit SessionRecorded(currentSessionId, patientAddress, msg.sender);

        currentSessionId++;
    }

    // Generate encrypted progress report for a patient
    function generateProgressReport(
        address patientAddress,
        uint8 overallProgress,
        uint8 complianceRate
    ) external onlyAuthorizedTherapist {
        require(patients[patientAddress].isRegistered, "Patient not registered");
        require(overallProgress <= 100, "Overall progress must be 0-100");
        require(complianceRate <= 100, "Compliance rate must be 0-100");

        // Encrypt progress metrics
        euint8 encryptedOverallProgress = FHE.asEuint8(overallProgress);
        euint8 encryptedComplianceRate = FHE.asEuint8(complianceRate);

        progressReports[patientAddress] = ProgressReport({
            encryptedPatientId: patients[patientAddress].encryptedPatientId,
            encryptedOverallProgress: encryptedOverallProgress,
            encryptedComplianceRate: encryptedComplianceRate,
            totalCompletedSessions: patients[patientAddress].totalSessions,
            lastUpdateTime: block.timestamp,
            reportGenerated: true
        });

        // Set access permissions
        FHE.allowThis(encryptedOverallProgress);
        FHE.allowThis(encryptedComplianceRate);
        FHE.allow(encryptedOverallProgress, patientAddress);
        FHE.allow(encryptedComplianceRate, patientAddress);

        emit ProgressUpdated(patientAddress, block.timestamp);
    }

    // Get patient registration status and basic info
    function getPatientInfo(address patientAddress) external view
        onlyPatientOrTherapist(patientAddress)
        returns (
            bool isRegistered,
            uint256 registrationTime,
            uint32 totalSessions
        )
    {
        Patient storage patient = patients[patientAddress];
        return (
            patient.isRegistered,
            patient.registrationTime,
            patient.totalSessions
        );
    }

    // Get session count for a patient
    function getPatientSessionCount(address patientAddress) external view
        onlyPatientOrTherapist(patientAddress)
        returns (uint32 sessionCount)
    {
        return uint32(patientSessions[patientAddress].length);
    }

    // Get session IDs for a patient
    function getPatientSessionIds(address patientAddress) external view
        onlyPatientOrTherapist(patientAddress)
        returns (uint32[] memory sessionIds)
    {
        return patientSessions[patientAddress];
    }

    // Get session basic info (non-encrypted data)
    function getSessionInfo(uint32 sessionId) external view returns (
        bool sessionCompleted,
        uint256 sessionTime,
        address authorizedTherapist
    ) {
        require(sessionId < currentSessionId, "Session does not exist");
        TreatmentSession storage session = treatmentSessions[sessionId];

        return (
            session.sessionCompleted,
            session.sessionTime,
            session.authorizedTherapist
        );
    }

    // Get progress report status
    function getProgressReportStatus(address patientAddress) external view
        onlyPatientOrTherapist(patientAddress)
        returns (
            bool reportGenerated,
            uint32 totalCompletedSessions,
            uint256 lastUpdateTime
        )
    {
        ProgressReport storage report = progressReports[patientAddress];
        return (
            report.reportGenerated,
            report.totalCompletedSessions,
            report.lastUpdateTime
        );
    }

    // Get contract statistics
    function getContractStats() external view returns (
        uint32 totalRegisteredPatients,
        uint32 totalRecordedSessions,
        uint256 contractCreationTime
    ) {
        return (
            totalPatients,
            currentSessionId - 1,
            block.timestamp
        );
    }

    // Check if address is authorized therapist
    function isAuthorizedTherapist(address therapist) external view returns (bool) {
        return authorizedTherapists[therapist];
    }

    // Emergency function to update admin (only current admin)
    function updateAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        admin = newAdmin;
    }
}