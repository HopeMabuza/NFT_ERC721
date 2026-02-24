require("@nomicfoundation/hardhat-toolbox");
//require("@nomicfoundation/hardhat-verify");
//require('@openzeppelin/hardhat-upgrades');

// require("@nomiclabs/hardhat-ethers");
// require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      // For local testing
    },
    polygon: {
      url: "https://polygon.drpc.org",
    }
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },

};