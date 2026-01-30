const { assert } = require("chai")

describe("test fundme contract", async function () {
    let fundMe
    let firstAccount
    beforeEach(async function () {
        await deployments.fixture(["all"])
        const firstAccount1 = await getNamedAccounts()
        ({firstAccount} = firstAccount1)
        console.log("firstAccount:", firstAccount1)
        firstAccount = firstAccount1.firstAccount
        console.log("firstAccount:", firstAccount)
        const {address} = await deployments.get("FundMe")
        // 这里可以不用第三个参数，默认就是第一个账户。如果要换其他账户，就自己选择用哪个caller
        const [defaultSigner, caller] = await ethers.getSigners();
        fundMe = await ethers.getContractAt("FundMe", address,defaultSigner)
        await fundMe.waitForDeployment()
    })
    it("test if the owner is msg.sender", async function () {
        const owner = await fundMe.owner()
        assert.equal(owner, firstAccount)
    })
    // it("test if the datafeed is assigned correctly", async function () {
    //     const dataFeed = await fundMe.dataFeed()
    //     assert.equal(dataFeed, "0x694AA1769357215DE4FAC081bf1f309aDC325306")
    // })
})
