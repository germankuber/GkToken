require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("solidity-coverage");
require("hardhat-gas-reporter");
require('hardhat-contract-sizer');
require("hardhat-watcher");
require("hardhat-tracer");
require('hardhat-log-remover');


task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
  console.log(await web3.eth.getBalance((await web3.eth.getAccounts())[0]));
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.7.3",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },
  watcher: {
    test:{
      tasks: ["test"], // Every task of the hardhat runtime is supported (including other plugins!)
      files: ["./test"], // Files, directories or glob patterns to watch for changes. (defaults to `[config.paths.sources]`, which itself defaults to the `contracts` dir)
      verbose: true // Turn on for extra logging
    }
  }
};

