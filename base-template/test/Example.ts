import { expect } from "chai";
import { ethers } from "hardhat";

/**
 * @test Example Contract Test Suite
 * @description Tests for the Example FHEVM contract
 * @chapter basic
 */
describe("Example", function () {
  async function deployFixture() {
    const signers = await ethers.getSigners();
    const deployer = signers[0];

    const contractFactory = await ethers.getContractFactory("Example");
    const contract = await contractFactory.deploy();

    return { contract, deployer };
  }

  describe("Deployment", function () {
    /**
     * @test Should deploy successfully
     * @description Verifies the contract deploys without errors
     */
    it("Should deploy successfully", async function () {
      const { contract } = await deployFixture();
      expect(contract.address).to.not.equal(ethers.ZeroAddress);
    });
  });

  describe("setValue", function () {
    /**
     * @test Should set encrypted value
     * @description Verifies encrypted value can be set
     */
    it("Should set encrypted value", async function () {
      const { contract } = await deployFixture();

      await expect(contract.setValue(0, "0x")).to.emit(contract, "ValueSet");
    });
  });

  describe("getValue", function () {
    /**
     * @test Should get encrypted value
     * @description Verifies encrypted value can be retrieved
     */
    it("Should get encrypted value", async function () {
      const { contract } = await deployFixture();

      const value = await contract.getValue();
      expect(value).to.exist;
    });
  });
});
