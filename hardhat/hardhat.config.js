/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config(); // Load environment variables
require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-chai-matchers");
module.exports = {
  solidity: "0.8.19",
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [
        "7480e9187fdc5829a8aa42c23be080bdbafb69a005a4fd0d57ac90986aca55b2",
      ],
    },
  },
};
