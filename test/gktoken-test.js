const { expect } = require("chai");

describe("GkToken", () => {
  let gkToken;
  let owner;
  let firstAccount;
  let secondAccount;
  before(async () => {
    const GkToken = await ethers.getContractFactory("GkToken");
    gkToken = await GkToken.deploy(1000);
    await gkToken.deployed();
    const accounts = await ethers.getSigners();
    owner = accounts[0];
    firstAccount = accounts[1];
    secondAccount = accounts[2];
    gkToken = await gkToken.connect(owner);
  });
  it("Owner should have all tokens", async () => {
    expect((await gkToken.balanceOf(owner.address)).toNumber()).to.equal(1000);
  });  
  
  it("transfer - should throw error if sender does not have tokens", async () => {
    gkToken = await gkToken.connect(firstAccount);
    await expect((gkToken.transfer(secondAccount.address, 100))).to.be
      .reverted.revertedWith('You do not have tokens to spend');
  });
  it("transfer - should transfer tokens to address", async () => {
    gkToken = await gkToken.connect(owner);
    await gkToken.transfer(firstAccount.address, 99);
    expect((await gkToken.balanceOf(firstAccount.address)).toNumber()).to.equal(99);
  });
  it("transfer - should emit event of Transfer", async () => {
    gkToken = await gkToken.connect(owner);
    await expect(gkToken.transfer(firstAccount.address, 99))
      .to.emit(gkToken, 'Transfer')
      .withArgs(owner.address, firstAccount.address, 99);
  });
  it("approve - should transfer tokens to address", async () => {
    gkToken = await gkToken.connect(owner);
    await gkToken.approve(firstAccount.address, 99);
    expect((await gkToken.allowance(owner.address, firstAccount.address)).toNumber()).to.equal(99);
  });
  it("approve - should emit event of Approval", async () => {
    gkToken = await gkToken.connect(owner);
    await expect(gkToken.approve(firstAccount.address, 99))
      .to.emit(gkToken, 'Approval')
      .withArgs(owner.address, firstAccount.address, 99);
  });

  it("transferFrom - should throw error if sender does not have tokens", async () => {
    gkToken = await gkToken.connect(owner);
     await expect((gkToken.transferFrom(firstAccount.address, owner.address, 45))).to.be
      .reverted;
  });
  it("transferFrom - should throw error if sender does not have tokens", async () => {
    gkToken = await gkToken.connect(owner);    
     await expect((gkToken.transferFrom(owner.address, firstAccount.address, 45))).to.be
      .revertedWith("From account does not have enough tokens");;
  });
  it("Transfer - should transfer the tokens", async () => {
    gkToken = await gkToken.connect(owner);
    await gkToken.approve(firstAccount.address, 99);
    gkToken = await gkToken.connect(firstAccount);
    await gkToken.transferFrom(owner.address, secondAccount.address, 45)
    expect((await gkToken.balanceOf(secondAccount.address)).toNumber()).to.equal(45);
  });
  it("Transfer - should emit event of Transfer", async () => {
    gkToken = await gkToken.connect(owner);
    await gkToken.approve(firstAccount.address, 99);
    gkToken = await gkToken.connect(firstAccount);
    await expect(gkToken.transferFrom(owner.address, secondAccount.address, 45))
    .to.emit(gkToken, 'Transfer')
    .withArgs(firstAccount.address, secondAccount.address, 45);
  });
  it("Transfer - to discount from allowance", async () => {
    gkToken = await gkToken.connect(owner);
    await gkToken.approve(firstAccount.address, 99);
    gkToken = await gkToken.connect(firstAccount);
    await gkToken.transferFrom(owner.address, secondAccount.address, 45);
    expect((await gkToken.allowance(owner.address, firstAccount.address)).toNumber()).to.equal(54);
  });
});
