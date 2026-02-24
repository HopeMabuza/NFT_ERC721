const hre = require("hardhat");

async function main() {
  console.log("Deploying NFT contract...");

  // Get the contract factory
  const NFT = await hre.ethers.getContractFactory("NFT");//*important
  
  const nft = await NFT.deploy("HopeNFT", "HN", "null", "null");//*important

  await  nft.waitForDeployment();//*important
  
  const address = await nft.getAddress();
   console.log(` deployed to: ${address}`);
  
  return address;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });