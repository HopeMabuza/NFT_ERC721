const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", function () {
    //define variables that will be used in the tests
    let NFT;
    let nft;
    let owner;
    let buyer1;
    let buyer2;
    let buyer3;
    const depositAmount = ethers.parseEther("1");

    beforeEach(async function () {
        [owner, buyer1, buyer2, buyer3] = await ethers.getSigners();
        const NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy("HopeNFT", "HNFT", "null", "null");
        await nft.waitForDeployment();
    }
    )});

describe("Mint", function (){
    it("Should let user mint tokens successfully", async function(){
        //get user1 initial balance of ETH
        const initialUserBal = await ethers.balanceOf(buyer1.getAddress());
        const initialContractBal = await ethers.balanceOf(nft.target);

        const mintAmount = 5;

        //connect buyer1 to contract and mint with 5 ETH
        await nft.connect(buyer1).mint(mintAmount);

        //assertions
        expect(await ethers.balanceOf(buyer1.getAddress())).to.equal(initialUserBal - mintAmount);
        expect(await ethers.balanceOf(nft.target)).to.equal(initialContractBal + mintAmount);


    })

});
