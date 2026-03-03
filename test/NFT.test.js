const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", function () {
    let nft;
    let owner;
    let buyer1;
    let buyer2;
    let buyer3;
    const mintCost = ethers.parseEther("1");

    beforeEach(async function () {
        [owner, buyer1, buyer2, buyer3] = await ethers.getSigners();
        const NFTFactory = await ethers.getContractFactory("NFT");
        nft = await NFTFactory.deploy("HopeNFT", "HNFT", "null", "null");
        
    });

    describe("Mint", function () {
        it("Should let user mint tokens successfully", async function () {
            const mintAmount = 5;
            const tokenCost = mintCost * BigInt(mintAmount);

            // Get initial balances
            const initialUserBal = await ethers.provider.getBalance(buyer1.address);
            const initialContractBal = await ethers.provider.getBalance(nft.target);

            // Mint tokens (user sends the required ETH)
            await nft.connect(buyer1).mint(mintAmount, { value: tokenCost });

            // Check token ownership
            expect(await nft.balanceOf(buyer1.address)).to.equal(mintAmount);
            expect(await nft.totalSupply()).to.equal(mintAmount);

            // Check contract ETH balance increased by exactly tokenCost
            const newContractBal = await ethers.provider.getBalance(nft.target);
            expect(newContractBal - initialContractBal).to.equal(tokenCost);

            // Check user's ETH decreased by at least tokenCost (gas fees extra)
            const newUserBal = await ethers.provider.getBalance(buyer1.address);
            expect(initialUserBal - newUserBal).to.be.greaterThanOrEqual(tokenCost);
        });

        it("Should let owner mint tokens successfully for free", async function(){
            const mintAmount = 5;

            const initialOwnerBal = await ethers.provider.getBalance(owner.address);
            const initialContractBal = await ethers.provider.getBalance(nft.target);

            await nft.mint(mintAmount);//not tokenCost

            expect(await nft.balanceOf(owner.address)).to.equal(mintAmount);
            expect(await nft.totalSupply()).to.equal(mintAmount);

            const newContractBal = await ethers.provider.getBalance(nft.target);
            expect(newContractBal).to.equal(initialContractBal);

            const newOwnerBal = await ethers.provider.getBalance(owner.address);
            expect(initialOwnerBal - newOwnerBal).to.be.greaterThanOrEqual(tokenCost);

        })
    });
});