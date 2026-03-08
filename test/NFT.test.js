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
            expect(initialOwnerBal).to.be.greaterThanOrEqual(newOwnerBal);

        });

        it("Should revert when buyer2 tries minting with insufficient funds", async function(){
            const mintAmount = 5;
            const tokenCost = mintCost * BigInt(mintAmount);
            const insufficientAmount = tokenCost - 1n;

            await expect( nft.connect(buyer2).mint(mintAmount, { value: insufficientAmount })).to.be.reverted;

        });

        it("Should revert when buyer2 tries minting over the maximun tokens for buyers", async function () {
            const mintAmount = 21;
            const tokenCost = mintCost * BigInt(mintAmount);
            
            await expect( nft.connect(buyer2).mint(mintAmount, { value: tokenCost })).to.be.reverted;

            
        });

        it("Should revert when buyer2 tries minting while the state of the contract is paused", async function(){
            //onwer pauses contract state
            await nft.connect(owner).pause(true);

            const mintAmount = 5;
            const tokenCost = mintCost * BigInt(mintAmount);

            await expect( nft.connect(buyer2).mint(mintAmount, { value: tokenCost })).to.be.reverted;

        });


    });

    describe("Get tokens for any user", function(){
        it("Should have an empty list if user has not minted", async function(){
            const tokenList = await nft.walletOfOwner(buyer3.address);

            expect(tokenList.length).to.equal(0);
        });

        it("Should get 2 tokens when user buys 2 tokens", async function(){
            const mintAmount = 2;
            const tokenCost = mintCost * BigInt(mintAmount);

            await nft.connect(buyer2).mint(mintAmount, { value: tokenCost });
            const tokenList = await nft.walletOfOwner(buyer2.address);

            expect(tokenList.length).to.equal(2);
            
        });

        it("Should only show tokens owner by that user", async function(){
            await nft.connect(buyer1).mint(2 , { value: mintCost * 2n });
            await nft.connect(buyer2).mint(3 , { value: mintCost * 3n });

            const buyer1TokenList = await nft.walletOfOwner(buyer1.address);
            const buyer2TokenList = await nft.walletOfOwner(buyer2.address);

            expect(buyer1TokenList.length).to.equal(2);
            expect(buyer2TokenList.length).to.equal(3);
        });

        it("Should reflect on the other user when buyer1 transfers tokens", async function(){
            await nft.connect(buyer1).mint(4 , { value: mintCost * 4n });
            //use let because we want to reassign the variable later on
            let buyer1TokenList = await nft.walletOfOwner(buyer1.address);

            expect(buyer1TokenList.length).to.equal(4);

            const tokenID = 1;
            await nft.connect(buyer1).transferFrom(buyer1.address, buyer2.address,tokenID);

            buyer1TokenList = await nft.walletOfOwner(buyer1.address);
            const buyer2TokenList = await nft.walletOfOwner(buyer2.address);

            expect(buyer1TokenList.length).to.equal(3);
            expect(buyer2TokenList.length).to.equal(1);
        });
    });

    describe("Set new cost", function(){
        it("Should successfully change cost if owner calls function", async function(){
            await nft.setCost(3);

            expect(await nft.cost()).to.equal(3);
        });

        it("Should revert when non-owner calls function", async function(){
        
            await expect(nft.connect(buyer1).setCost(3)).to.be.revertedWith('Ownable: caller is not the owner');
        });
    });

    describe("Set new maximumAmount", function(){
        it("Should successfully change maximumAmount if owner calls function", async function(){
            await nft.setmaxMintAmount(30);

            expect(await nft.maxMintAmount()).to.equal(30);
        });
        it("Should revert when non-owner calls function", async function () {

            await expect(nft.connect(buyer1).setmaxMintAmount(30)).to.be.revertedWith('Ownable: caller is not the owner');
        });
    });

    describe("Withdrawal", function(){
        it("Should revert when non-owner calls function", async function () {

            await expect(nft.connect(buyer1).withdraw()).to.be.revertedWith('Ownable: caller is not the owner');
        });

        it("Should successfully transfer all funds from contract to owner", async function(){
            await nft.connect(buyer3).mint(4, {value: mintCost * 4n});

            await nft.withdraw();

            const newContractBalance = await ethers.provider.getBalance(nft.target);

            expect(newContractBalance).to.equal(0);
        });
    });

    describe("Set new BaseExtension", function(){
        it("Should successfully change BaseExtension if owner calls function", async function(){
            await nft.setBaseExtension(".txt");

            expect(await nft.baseExtension()).to.equal(".txt");
        });
        it("Should revert when non-owner calls function", async function () {

            await expect(nft.connect(buyer1).setBaseExtension(".txt")).to.be.revertedWith('Ownable: caller is not the owner');
        });
    });

    describe("Get token URI", function(){
        it("Should return correct tokenURI", async function(){
            await nft.connect(buyer1).mint(4, { value: mintCost * 4n });
            const tokenURI = await nft.tokenURI(1);
            expect(tokenURI).to.equal("null1.json");
        });

        it("Should revert when checking URI of not existing token", async function(){
           await expect(nft.tokenURI(1)).to.be.revertedWith('ERC721Metadata: URI query for nonexistent token');
        });
    });

});