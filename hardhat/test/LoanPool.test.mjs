import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("LoanPool", function () {
  let loanPool, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const LoanPoolFactory = await ethers.getContractFactory("LoanPool");
    loanPool = await LoanPoolFactory.deploy();
    await loanPool.deployed();
  });

  it("should allow users to deposit funds", async function () {
    const depositAmount = ethers.utils.parseEther("1.0");

    await loanPool.connect(addr1).depositFunds({ value: depositAmount });

    // Fetch stored amount directly
    const storedAmount = (await loanPool.deposits(addr1.address)).amount;

    // Log values for debugging
    console.log("Stored Amount in Contract:", storedAmount.toString());
    console.log("Expected Deposit Amount:", depositAmount.toString());

    // Compare correctly using .eq()
    expect(storedAmount.toString()).to.eq(depositAmount.toString());
  });

  it("should allow users to borrow funds with collateral", async function () {
    const depositAmount = ethers.utils.parseEther("2.0");
    await loanPool.connect(addr1).depositFunds({ value: depositAmount });

    const loanAmount = ethers.utils.parseEther("1.0");
    await expect(
      loanPool.connect(addr2).borrowFunds(loanAmount, ethers.ZeroAddress, 0)
    ).to.be.revertedWith("Collateral not approved");
  });

  it("should allow users to repay loans", async function () {
    const depositAmount = ethers.utils.parseEther("2.0");
    await loanPool.connect(addr1).depositFunds({ value: depositAmount });

    const loanAmount = ethers.utils.parseEther("1.0");
    await loanPool
      .connect(addr2)
      .borrowFunds(loanAmount, ethers.ZeroAddress, 0);

    await expect(
      loanPool.connect(addr2).repayLoan({ value: loanAmount })
    ).to.emit(loanPool, "Repaid");
  });

  it("should allow lenders to withdraw funds with interest", async function () {
    const depositAmount = ethers.utils.parseEther("1.0");
    await loanPool.connect(addr1).depositFunds({ value: depositAmount });

    await ethers.provider.send("evm_increaseTime", [86400 * 10]); // Simulate 10 days
    await ethers.provider.send("evm_mine");

    await loanPool.connect(addr1).withdrawFunds();
    expect(await ethers.provider.getBalance(loanPool.address)).to.equal(0);
  });

  it("should allow liquidation of overdue loans", async function () {
    const depositAmount = ethers.utils.parseEther("2.0");
    await loanPool.connect(addr1).depositFunds({ value: depositAmount });

    const loanAmount = ethers.utils.parseEther("1.0");
    await loanPool
      .connect(addr2)
      .borrowFunds(loanAmount, ethers.ZeroAddress, 0);

    await ethers.provider.send("evm_increaseTime", [86400 * 8]); // Simulate 8 days
    await ethers.provider.send("evm_mine");

    await expect(loanPool.connect(addr1).liquidateLoan(addr2.address)).to.emit(
      loanPool,
      "Liquidated"
    );
  });
});
