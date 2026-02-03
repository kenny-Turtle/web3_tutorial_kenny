const { DECIMAL, INITIAL_ANSWER ,developmentChains} = require("../helper-hardhat-config")

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { firstAccount, secondAccount } = await getNamedAccounts()
    const { deploy } = deployments

    // if (network.config.chainId !== 11155111) {
    //     await deploy("MockV3Aggregator", {
    //         from: firstAccount,
    //         args: [DECIMAL, INITIAL_ANSWER],
    //         log: true,
    //     })
    // }
    if(developmentChains.includes(network.name)){
        await deploy("MockV3Aggregator",{
            from: firstAccount,
            args: [DECIMAL, INITIAL_ANSWER],
            log: true,
        })
    }else{
        console.log("MockV3Aggregator contract not deployed on this network")
    }
}

module.exports.tags = ["all", "mock"]