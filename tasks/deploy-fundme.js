const { task } = require("hardhat/config")

task("deploy-fundme", "deploy and verify FundMe contract").setAction(
    async (taskArgs, hre) => {
        // create factory
        const fundMeFactory = await ethers.getContractFactory("FundMe")
        console.log("contract deploying")
        // deploy contract from factory
        const fundMe = await fundMeFactory.deploy(180)
        await fundMe.waitForDeployment()
        console.log(
            "contract has been deployed successfully, contract address is " +
                fundMe.target
        )

        // verify FundMe contract
        if (
            hre.network.config.chainId === 11155111 &&
            process.env.ETHERSCAN_API_KEY
        ) {
            console.log("Wait 5 blocks for transaction to be mined")
            await fundMe.deploymentTransaction().wait(5)
            verifyFundMe(fundMe.target, [180])
        } else {
            console.log(
                "FundMe contract not deployed on sepolia network, skip verification"
            )
        }
    }
)
async function verifyFundMe(fundMeAddr, args) {
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
    })
}

module.exports = {}
