const { task } = require("hardhat/config");

task("interact-fundme","interact with FundMe contract")
  .addParam("addr", "fundme contract address")
  .setAction(async (taskArgs, hre) => {
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = fundMeFactory.attach(taskArgs.addr);
    // init 2 accounts
    const [firstAccount, secondAccount] = await ethers.getSigners();
    console.log("xxxxx " + firstAccount);
    console.log("first account address is " + firstAccount.address);
    console.log("second account address is " + secondAccount.address);
    // fund contract with first account
    const fundTx = await fundMe.fund({ value: ethers.parseEther("0.02") });
    await fundTx.wait(1);
    // check balance of contract
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target);
    console.log(
      "balance of contract is " + ethers.formatEther(balanceOfContract),
    );
    // fund contract with second account
    const fundTx2 = await fundMe
      .connect(secondAccount)
      .fund({ value: ethers.parseEther("0.02") });
    await fundTx2.wait(1);
    // check balance of contract
    const balanceOfContract2 = await ethers.provider.getBalance(fundMe.target);
    console.log(
      "balance of contract after second fund is " +
        ethers.formatEther(balanceOfContract2),
    );
    // check mapping fundersToAmount
    const firstAccountFunderAmount = await fundMe.funders2Amount(
      firstAccount.address,
    );
    const secondAccountFunderAmount = await fundMe.funders2Amount(
      secondAccount.address,
    );
    console.log(
      "first account funder amount is " +
        ethers.formatEther(firstAccountFunderAmount),
    );
    console.log(
      "second account funder amount is " +
        ethers.formatEther(secondAccountFunderAmount),
    );
  });

module.exports = {};
