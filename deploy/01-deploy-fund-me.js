const {
    developmentChains,
    networkConfig,
    lockTime,
    confirmations,
} = require("../helper-hardhat-config")
const { network } = require("hardhat")

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
    // const chainId = network.config.chainId
    // if (chainId === 11155111) {
    //     mockAddress1 = "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    // } else {
    //     const { address } = await deployments.get("MockV3Aggregator")
    //     console.log("mockAddress:", address)
    //     mockAddress1 = address
    // }
    // console.log("mockAddress1:", mockAddress1)

    let fundMe
    if (developmentChains.includes(network.name)) {
        const { address } = await deployments.get("MockV3Aggregator")
        console.log("mockAddress:", address)
        mockAddress1 = address

        fundMe = await deploy("FundMe", {
        from: firstAccount,
        args: [lockTime, mockAddress1],
        log: true,
    })
    } else {
        mockAddress1 = networkConfig[network.config.chainId].ethUsdPriceFeed

        fundMe = await deploy("FundMe", {
        from: firstAccount,
        args: [lockTime, mockAddress1],
        log: true,
        waitConfirmations: confirmations,
    })
    }
    console.log("mockAddress1:", mockAddress1)

    // const fundMe = await deploy("FundMe", {
    //     from: firstAccount,
    //     args: [lockTime, mockAddress1],
    //     log: true,
    //     waitConfirmations: confirmations,
    // })
    // console.log("FundMe:", fundMe)
    console.log("FundMe deployed at:", fundMe.address)



    if (
        hre.network.config.chainId === 11155111 &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments: [lockTime, mockAddress1],
        })
    } else {
        console.log("FundMe contract not in sepolia network, not verified on Etherscan")
    }
}

module.exports.tags = ["all", "fundme"]
