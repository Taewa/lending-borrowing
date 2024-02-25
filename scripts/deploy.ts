import { ethers } from "hardhat";
// fakeUSDC address:          0x9E2a02181c9dB97b9122F1D4771AC936F3CC0336
// lendingBorrowing address:  0x43Fe125d1b742C07bf25008122A0ba8B1A5C1E87
async function main() {
  const [deployer] = await ethers.getSigners();

  /**
   * FakeUSDC Contract
   */
  
  const fakeUSDC = await ethers.deployContract("FakeUSDC", [deployer]);
  
  await fakeUSDC.waitForDeployment();

  const fakeUSDCAddress = await fakeUSDC.getAddress();
  console.log(`fakeUSDC address: ${fakeUSDCAddress}`);


  /**
   * LendingBorrowing Contract
   */

  const lendingBorrowing = await ethers.deployContract("LendingBorrowing", [fakeUSDCAddress]);

  await lendingBorrowing.waitForDeployment();

  const lendingBorrowingAddress = await lendingBorrowing.getAddress();
  console.log(`lendingBorrowing address: ${lendingBorrowingAddress}`);

  /**
   * Minting
   */
  await fakeUSDC.mintToTokenManager(lendingBorrowingAddress);

  const balanceOfTokenManager = await fakeUSDC.balanceOf(lendingBorrowingAddress);

  console.log(`now, the token manager (lendingBorrowing contract) has: ${balanceOfTokenManager} fake USDC`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
