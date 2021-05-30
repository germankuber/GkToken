// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const GkToken = await hre.ethers.getContractFactory("GkToken");
  const gkToken = await GkToken.deploy(1000);

  await gkToken.deployed();

  const GkTokenSale = await hre.ethers.getContractFactory("GkToken");
  const gkTokenSale = await GkTokenSale.deploy(1000);

  await gkTokenSale.deployed();

  console.log("GkToken deployed to:", gkToken.address);
  console.log("GkTokenSale deployed to:", gkTokenSale.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
