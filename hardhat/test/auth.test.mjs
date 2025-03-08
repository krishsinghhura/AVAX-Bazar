import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("Auth contract", function () {
  let Auth, auth, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    Auth = await ethers.getContractFactory("Auth");
    auth = await Auth.deploy();
    await auth.deployed();
  });

  it("signup", async function () {
    await auth.connect(addr1).signup();
    expect(await auth.users(0)).to.equal(addr1.address);
  });

  it("login", async function () {
    // return true if logs in
    await auth.connect(addr1).signup(); // signinup first and then logging in
    expect(await auth.login(addr1.address)).to.equal(true);
  });

  it("login fail", async function () {
    //suppose we are not signinup so ofc it should return false
    expect(await auth.login(addr1.address)).to.equal(false);
  });
});
