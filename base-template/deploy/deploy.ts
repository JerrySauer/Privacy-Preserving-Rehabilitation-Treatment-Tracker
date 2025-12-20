import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedExample = await deploy("Example", {
    from: deployer,
    log: true,
  });

  console.log(`Example contract: ${deployedExample.address}`);
};

export default func;
func.id = "deploy_example";
func.tags = ["Example"];
