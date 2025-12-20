/**
 * @title Documentation Generator for Privacy Rehabilitation Record
 * @description Automated documentation generation tool for FHEVM example
 *
 * This script extracts documentation from test files and generates GitBook-compatible
 * markdown documentation following the Zama bounty requirements.
 */

import * as fs from 'fs';
import * as path from 'path';

interface DocSection {
  title: string;
  description: string;
  chapter?: string;
  tests: TestCase[];
}

interface TestCase {
  name: string;
  description: string;
  code?: string;
}

/**
 * Extract documentation comments from test files
 */
function extractTestDocs(filePath: string): DocSection[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const sections: DocSection[] = [];
  let currentSection: DocSection | null = null;

  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Extract describe blocks as sections
    if (line.includes('describe(')) {
      const match = line.match(/describe\("([^"]+)"/);
      if (match) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: match[1],
          description: '',
          tests: []
        };
      }
    }

    // Extract @section comments
    if (line.includes('@section')) {
      const sectionMatch = line.match(/@section (.+)/);
      if (sectionMatch && currentSection) {
        currentSection.title = sectionMatch[1];
      }
    }

    // Extract @chapter tags
    if (line.includes('@chapter') && currentSection) {
      const chapterMatch = line.match(/@chapter (.+)/);
      if (chapterMatch) {
        currentSection.chapter = chapterMatch[1];
      }
    }

    // Extract @description
    if (line.includes('@description') && currentSection) {
      let desc = '';
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].includes('*/') || lines[j].includes('@')) break;
        desc += lines[j].replace(/\s*\*\s*/, '') + ' ';
      }
      currentSection.description = desc.trim();
    }

    // Extract it blocks as test cases
    if (line.includes('it("')) {
      const testMatch = line.match(/it\("([^"]+)"/);
      if (testMatch && currentSection) {
        let testDesc = '';
        // Look backwards for @test comment
        for (let j = i - 1; j >= 0; j--) {
          if (lines[j].includes('@description')) {
            for (let k = j + 1; k < i; k++) {
              if (lines[k].includes('*/')) break;
              testDesc += lines[k].replace(/\s*\*\s*/, '') + ' ';
            }
            break;
          }
          if (lines[j].includes('/**')) break;
        }

        currentSection.tests.push({
          name: testMatch[1],
          description: testDesc.trim()
        });
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Generate README documentation
 */
function generateReadme(sections: DocSection[]): string {
  let readme = `# Privacy Rehabilitation Record - FHEVM Example

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
- **euint32**: Encrypted 32-bit unsigned integers (patient IDs)
- **euint8**: Encrypted 8-bit unsigned integers (scores, treatment types)
- **ebool**: Encrypted boolean values

### Access Control
- **FHE.allow()**: Grant access to encrypted values
- **FHE.allowThis()**: Grant contract access to encrypted values
- **FHE.allowTransient()**: Temporary access permissions

### Privacy Features
- Patient data remains encrypted on-chain
- Only authorized parties can decrypt specific values
- Zero-knowledge proof system for data verification

## 📋 Test Coverage

`;

  // Group sections by chapter
  const chapterMap = new Map<string, DocSection[]>();

  sections.forEach(section => {
    const chapter = section.chapter || 'general';
    if (!chapterMap.has(chapter)) {
      chapterMap.set(chapter, []);
    }
    chapterMap.get(chapter)!.push(section);
  });

  // Generate documentation by chapter
  chapterMap.forEach((chapterSections, chapter) => {
    readme += `### ${chapter.charAt(0).toUpperCase() + chapter.slice(1)}\n\n`;

    chapterSections.forEach(section => {
      readme += `#### ${section.title}\n\n`;
      if (section.description) {
        readme += `${section.description}\n\n`;
      }

      if (section.tests.length > 0) {
        readme += `**Test Cases:**\n\n`;
        section.tests.forEach(test => {
          readme += `- ✓ ${test.name}\n`;
          if (test.description) {
            readme += `  - ${test.description}\n`;
          }
        });
        readme += '\n';
      }
    });
  });

  readme += `## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to testnet
npm run deploy
\`\`\`

## 📖 Documentation Structure

- \`contracts/\` - Solidity smart contracts
- \`test/\` - Comprehensive test suite with TSDoc comments
- \`scripts/\` - Deployment and automation scripts
- \`public/\` - Frontend interface

## 🏗️ Architecture

\`\`\`
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
\`\`\`

## 🔒 Security Considerations

- All sensitive patient data is encrypted using FHE
- Role-based access control (Admin, Therapist, Patient)
- Input validation for all user-provided data
- Proper permission management with FHE.allow()
- No plaintext sensitive data stored on-chain

## 📊 Use Cases

1. **Patient Registration**: Secure enrollment with encrypted IDs
2. **Treatment Tracking**: Confidential session recording
3. **Progress Monitoring**: Encrypted progress reports
4. **Therapist Management**: Secure authorization system
5. **Compliance Tracking**: Privacy-preserving metrics

## 🎓 Learning Resources

- [Zama Documentation](https://docs.zama.ai)
- [FHEVM Docs](https://docs.fhevm.zama.ai)
- [Solidity Documentation](https://docs.soliditylang.org)

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This is a bounty submission for the Zama FHEVM Example Hub. Contributions and feedback are welcome!

---

**Built with ❤️ for the Zama FHE Ecosystem**
`;

  return readme;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Generating documentation...\n');

  // Find test files
  const testDir = path.join(__dirname, '..', 'test');
  const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith('.test.ts'));

  console.log(`📂 Found ${testFiles.length} test file(s)\n`);

  let allSections: DocSection[] = [];

  testFiles.forEach(file => {
    const filePath = path.join(testDir, file);
    console.log(`📖 Processing ${file}...`);
    const sections = extractTestDocs(filePath);
    allSections = allSections.concat(sections);
  });

  console.log(`\n✅ Extracted ${allSections.length} documentation sections\n`);

  // Generate README
  const readme = generateReadme(allSections);
  const readmePath = path.join(__dirname, '..', 'DOCUMENTATION.md');
  fs.writeFileSync(readmePath, readme);

  console.log(`📄 Generated DOCUMENTATION.md\n`);

  // Generate summary for GitBook
  const summary = generateGitBookSummary(allSections);
  const summaryPath = path.join(__dirname, '..', 'SUMMARY.md');
  fs.writeFileSync(summaryPath, summary);

  console.log(`📑 Generated SUMMARY.md for GitBook\n`);

  console.log('✨ Documentation generation complete!\n');
}

/**
 * Generate GitBook-compatible SUMMARY.md
 */
function generateGitBookSummary(sections: DocSection[]): string {
  let summary = `# Summary

## Introduction

* [Overview](README.md)
* [Full Documentation](DOCUMENTATION.md)

## Concepts

* [Getting Started](DOCUMENTATION.md#quick-start)
* [Key FHEVM Concepts](DOCUMENTATION.md#key-fhevm-concepts)

## Test Coverage

`;

  sections.forEach(section => {
    summary += `* [${section.title}](DOCUMENTATION.md#${section.title.toLowerCase().replace(/\s+/g, '-')})\n`;
  });

  summary += `
## Additional Resources

* [Security Considerations](DOCUMENTATION.md#security-considerations)
* [Architecture](DOCUMENTATION.md#architecture)
* [Use Cases](DOCUMENTATION.md#use-cases)
`;

  return summary;
}

// Run the script
main();
