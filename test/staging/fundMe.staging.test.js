const { assert, expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const { developmentChains } = require("../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("test fundme contract", async function () {
          let fundMe
          let firstAccount
          beforeEach(async function () {
              await deployments.fixture(["all"])
              const firstAccount1 = await getNamedAccounts()
              console.log("firstAccount1:", firstAccount1)
              firstAccount = firstAccount1.firstAccount
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
          })
          // test fund and getFund successfully emits events
          it("fund and getfund successfully emits events", async function () {
              await fundMe.fund({ value: ethers.parseEther("0.04") })
              // make sure the window is close
              await new Promise((resolve) => setTimeout(resolve, 181 * 1000)) // wait for 181 seconds
              const fundTx = await fundMe.getFund()
              const receipt = await fundTx.wait()
              expect(receipt)
                  .to.be.emit(fundMe, "FundWithdrawByOwner")
                  .withArgs(ethers.parseEther("0.02"))
          })
          // test refund successfully emits event
          it("refund successfully emits event", async function () {
              await fundMe.fund({ value: ethers.parseEther("0.01") })
              await new Promise((resolve) => setTimeout(resolve, 181 * 1000)) // wait for 181 seconds
              const fundTx = await fundMe.refund()
              const receipt = await fundTx.wait()
              expect(receipt)
                  .to.be.emit(fundMe, "RefundByFunder")
                  .withArgs(firstAccount, ethers.parseEther("0.01"))
          })
      })
