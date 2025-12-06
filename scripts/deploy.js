const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Privacy Rehabilitation Records contract...");

  // Get the contract factory
  const PrivacyRehabilitationRecord = await ethers.getContractFactory("PrivacyRehabilitationRecord");

  // Deploy the contract
  const contract = await PrivacyRehabilitationRecord.deploy();
  await contract.deployed();

  console.log("✅ Contract deployed successfully!");
  console.log("📄 Contract address:", contract.address);
  console.log("🔗 Network:", network.name);
  console.log("👤 Deployer:", await contract.admin());

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contract.address,
    network: network.name,
    deployer: await contract.admin(),
    deploymentTime: new Date().toISOString(),
    txHash: contract.deployTransaction.hash
  };

  console.log("\n📋 Deployment Details:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Wait for a few block confirmations
  console.log("\n⏳ Waiting for block confirmations...");
  await contract.deployTransaction.wait(3);
  console.log("✅ Contract confirmed on blockchain");

  console.log("\n🎯 Next steps:");
  console.log("1. Update CONTRACT_ADDRESS in public/index.html");
  console.log("2. Verify contract on Etherscan (if on testnet/mainnet)");
  console.log("3. Test contract functions through the frontend");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });