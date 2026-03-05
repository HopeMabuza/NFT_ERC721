# NFT Contract Testing with Hardhat

This repository demonstrates my understanding of **smart contract testing** using Hardhat, Chai, and ethers.js. It contains a comprehensive test suite for an ERC721 NFT contract (based on OpenZeppelin’s `ERC721Enumerable` and `Ownable`). The goal was to write robust, production‑ready tests covering all core functionalities and edge cases.

## The NFT Contract Overview

The contract under test (`NFT_contracts.sol`) implements a typical NFT collection with the following features:

- **ERC721Enumerable** – allows enumeration of tokens owned by an address and total supply.
- **Ownable** – restricts certain functions to the contract owner.
- **Minting**:
  - Public mint with a cost (default 1 ether).
  - Maximum mint amount per transaction (20 tokens).
  - Maximum total supply (8574 tokens).
  - Owner can mint for free.
- **Pausable** – owner can pause/unpause minting.
- **Reveal mechanism** – owner can reveal the actual metadata URI.
- **Withdraw** – owner can withdraw all Ether accumulated from mints.
- **Helper functions** – `walletOfOwner` returns all token IDs owned by an address.

## Testing Approach

The test suite is written in JavaScript using **Hardhat** as the development environment, **Chai** for assertions, and **ethers.js** for blockchain interactions. Key aspects tested include:

### 1. Minting functionality
-  Successful mint by a user with correct payment.
-  Owner minting for free.
-  Revert when user sends insufficient funds.
-  Revert when mint amount exceeds `maxMintAmount`.
-  Revert when contract is paused.
-  Revert when mint amount is zero.

### 2. Ownership and enumerability (`walletOfOwner`)
-  Returns empty array for an address without tokens.
-  Returns correct token IDs after minting multiple tokens.
-  Returns only tokens owned by the queried address (no cross‑contamination).
-  Updates correctly after a token transfer.

### 3. Access control (onlyOwner functions)
-  Owner can change `cost`, `maxMintAmount`, `baseURI`, `baseExtension`, `notRevealedUri`, pause state, and reveal.
-  Non‑owner attempts to call these functions revert with `"Ownable: caller is not the owner"`.

### 4. Withdrawal
-  Owner can withdraw all contract balance.
-  Non‑owner cannot call `withdraw`.
- After withdrawal, contract balance becomes zero.

### 5. Edge Cases
- Testing exact revert messages (when provided) or generic reverts (when no reason string is given).
- Gas cost awareness – verifying that user balances decrease by at least the mint cost, accounting for gas.

## Why This Matters

Writing thorough tests for smart contracts is critical because:
- **Security** – catching vulnerabilities before deployment.
- **Correctness** – ensuring business logic works as intended.
- **Documentation** – tests serve as executable specifications.
- **Confidence** – refactoring or upgrading contracts becomes safer.

This project showcases my ability to:
- Understand complex smart contract interactions.
- Use Hardhat’s testing framework effectively.
- Handle asynchronous blockchain calls and assertions.
- Test both success paths and failure modes (reverts).
- Write clean, maintainable test code.

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation
```bash
git clone <repo-url>
cd <repo-name>
npm install
```

### Running the Tests
```bash
npx hardhat test
```

All tests should pass (as shown in the final output).

## Dependencies
- [Hardhat](https://hardhat.org/) – Ethereum development environment.
- [Chai](https://www.chaijs.com/) – assertion library.
- [Ethers.js](https://docs.ethers.org/) – Ethereum wallet and contract interaction.
- [OpenZeppelin Contracts](https://www.openzeppelin.com/contracts) – base ERC721 implementation.

## What I Learned
- How to structure a test suite for a smart contract using `describe` and `beforeEach`.
- The importance of scoping variables correctly.
- Proper use of `await expect(...).to.be.reverted` vs. executing a transaction prematurely.
- Testing state changes (balances, ownership) after transactions.
- Handling payable functions and Ether amounts in tests.

## Conclusion
This repository reflects my hands‑on experience with blockchain testing – a crucial skill for any Ethereum developer. By building this test suite, I’ve deepened my understanding of both Solidity smart contracts and the tools used to secure them. Feel free to explore the test files and see the coverage!

---
