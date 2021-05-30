const { expect } = require("chai");

describe("GkTokenSale", () => {
  let gkToken;
  let gkTokenSale;
  let owner;
  let firstAccount;
  let secondAccount;
  before(async () => {
    gkToken = await (await ethers.getContractFactory("GkToken")).deploy(1000);
    await gkToken.deployed();
    gkTokenSale = await (await ethers.getContractFactory("GkTokenSale")).deploy(10, gkToken.address);
    await gkTokenSale.deployed();

    await gkToken.transfer(gkTokenSale.address, 1000);

    const accounts = await ethers.getSigners();
    owner = accounts[0];
    firstAccount = accounts[1];
    secondAccount = accounts[2];
    gkToken = await gkToken.connect(owner);
  });
  it("buy - should throw error if sender does send the same value", async () => {
    await expect((gkTokenSale.buy(1, { value: 2 }))).to.be
      .revertedWith("The amount is different");
  });

  it("buy - the contract does not have enough tokens", async () => {
    await (await gkTokenSale.connect(firstAccount)).buy(10, { value: 100 });
    expect((await gkToken.balanceOf(firstAccount.address)).toNumber()).to.equal(10);
  });
  
  it("buy - balance of contract", async () => {
    await (await gkTokenSale.connect(firstAccount)).buy(10, { value: 100 });
    await (await gkTokenSale.connect(secondAccount)).buy(10, { value: 100 });
    expect(await web3.eth.getBalance(gkTokenSale.address)).to.equal("300");
  });
  it("buy - emit sold event", async () => {
    await expect(gkTokenSale.buy(10, { value: 100 }))
    .to.emit(gkTokenSale, 'Sold')
    .withArgs(owner.address, 10);
  });

  it("endSold - should revert if is not the owner", async () => {
    await expect((await gkTokenSale.connect(secondAccount)).endSold()).to.be
    .revertedWith("Ownable: caller is not the owner");
  });

  it("endSold - return tokens to the owner", async () => {
    await (await gkTokenSale.connect(firstAccount)).buy(1, { value: 1 });
    await gkTokenSale.endSold();
    expect((await gkToken.balanceOf(owner.address)).toNumber()).to.equal(969);
  });
  // it("endSold - send current value to the owner", async () => {
  //   await (await gkTokenSale.connect(firstAccount)).buy(1, { value: 1 });
  //   await gkTokenSale.endSold();
  //   //TODO: Need to implement the  except
  // });
 
});
