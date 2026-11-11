import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("----------------------------------------------------");
  console.log("Deploying HarvestNote to Botchain Testnet (Chain ID 968)...");
  console.log("----------------------------------------------------");

  const [deployer] = await ethers.getSigners();
  if (deployer) {
    console.log("Deployer address:", deployer.address);
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Deployer balance:", ethers.formatEther(balance), "BOHR");
  }

  const HarvestNote = await ethers.getContractFactory("HarvestNote");
  const harvestNote = await HarvestNote.deploy();

  await harvestNote.waitForDeployment();
  const contractAddress = await harvestNote.getAddress();

  console.log("====================================================");
  console.log("HarvestNote successfully deployed!");
  console.log("Contract Address:", contractAddress);
  console.log("Block Explorer:", `https://scan.bohr.life/address/${contractAddress}`);
  console.log("====================================================");
  console.log("\nNext Steps:");
  console.log("1. Copy this contract address.");
  console.log("2. Set NEXT_PUBLIC_HARVESTNOTE_CONTRACT_ADDRESS in .env.local or update lib/contract.ts.");
  console.log("3. Start the frontend with `npm run dev`.");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});

