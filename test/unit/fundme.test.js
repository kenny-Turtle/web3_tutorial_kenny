const { assert, expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("test fundme contract", async function () {
          let fundMe
          let firstAccount, secondAccount, fundMeSecond
          beforeEach(async function () {
              await deployments.fixture(["all"])
              const firstAccount1 = await getNamedAccounts()
              console.log("firstAccount1:", firstAccount1)
              firstAccount = firstAccount1.firstAccount
              secondAccount = firstAccount1.secondAccount
              console.log("secondAccount:", secondAccount)
              console.log("firstAccount:", firstAccount)
              const { address } = await deployments.get("FundMe")
              // 这里可以不用第三个参数，默认就是第一个账户。如果要换其他账户，就自己选择用哪个caller
              const [defaultSigner, caller] = await ethers.getSigners()
              fundMe = await ethers.getContractAt(
                  "FundMe",
                  address,
                  defaultSigner
              )
              await fundMe.waitForDeployment()
              fundMeSecond = await ethers.getContractAt(
                  "FundMe",
                  address,
                  caller
              )
              console.log("fundMeSecond:", fundMeSecond.target)
          })
          it("test if the owner is msg.sender", async function () {
              const owner = await fundMe.owner()
              assert.equal(owner, firstAccount)
          })

          // fund, getFund, refund
          // unit test for fund
          // window open, value greater than minimum value, funder balance
          it("window cloesd, value grater than minimum, fund failed", async function () {
              // make sure the window is cloesd
              await helpers.time.increase(200)
              // mine a block
              await helpers.mine()
              await expect(
                  fundMe.fund({ value: ethers.parseEther("0.1") })
              ).to.be.revertedWith("window is close")
          })
          it("window open, value less than minimum, fund failed", async function () {
              // make sure the window is open
              await helpers.time.increase(100)
              await helpers.mine()
              await expect(
                  fundMe.fund({ value: ethers.parseEther("0.001") })
              ).to.be.revertedWith("send more ETH")
          })
          it("window open, value greater than minimum, funder balance increased", async function () {
              await fundMe.fund({ value: ethers.parseEther("0.1") })
              const fundersBalance = await fundMe.funders2Amount(firstAccount)
              await assert.equal(fundersBalance, ethers.parseEther("0.1"))
          })

          // unit test for getFund
          // only owner, windowClose, target reached
          it("only owner call call getFund", async function () {
              await fundMe.fund({ value: ethers.parseEther("1") })
              // make sure the window is close
              await helpers.time.increase(200)
              await helpers.mine()
              // only owner
              await expect(fundMeSecond.getFund()).to.be.revertedWith(
                  "this function can only be called by owner"
              )
          })
          it("window open,target reached, getfund failed", async function () {
              await fundMe.fund({ value: ethers.parseEther("0.1") })
              // target reached, open open
              await expect(fundMe.getFund()).to.be.revertedWith(
                  "Funding period has not ended yet"
              )
          })
          it("window close,target reached,getfund success", async function () {
              await fundMe.fund({ value: ethers.parseEther("1") })
              await helpers.time.increase(200)
              await helpers.mine()
              await expect(fundMe.getFund())
                  .to.emit(fundMe, "FundWithdrawByOwner")
                  .withArgs(ethers.parseEther("1"))
          })
      })
