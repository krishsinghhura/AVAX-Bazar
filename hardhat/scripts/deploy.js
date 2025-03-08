async function main() {
  const [deployer] = await ethers.getSigners();

  const Token = await ethers.getContractFactory("Auth");
  const hardhatToken = await Token.deploy();
  await hardhatToken.deployed();
  console.log(hardhatToken.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
