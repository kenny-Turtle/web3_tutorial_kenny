// function deployFunction(){
//     console.log("deploying FundMe contract..."  )
// }
// module.exports = deployFunction
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount, secondAccount } = await getNamedAccounts()
    const { deploy } = deployments

    console.log("firstAccount:", firstAccount)
    console.log("secondAccount:", secondAccount)
    console.log("deploying FundMe contract...3333333")

    // 获取mock的合约地址
    let mockAddress1
    const chainId = network.config.chainId
    if (chainId === 11155111) {
        mockAddress1 = "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    } else {
        const { address } = await deployments.get("MockV3Aggregator")
        console.log("mockAddress:", address)
        // const mockV3 = await ethers.getContractAt("MockV3Aggregator", mockAddress)
        // await mockV3.waitForDeployment()
        // console.log("mockV3 deployed to:", await mockV3.getAddress())
        mockAddress1 = address
    }
    console.log("mockAddress1:", mockAddress1)



    await deploy("FundMe", {
        from: firstAccount,
        args: [180, mockAddress1],
        log: true,
    })
}

module.exports.tags = ["all", "fundme"]
