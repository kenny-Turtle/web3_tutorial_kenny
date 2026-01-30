const { DECIMAL, INITIAL_ANSWER } = require("../helper-hardha-config")

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { firstAccount, secondAccount } = await getNamedAccounts()
    const { deploy } = deployments

    if (network.config.chainId !== 11155111) {
        await deploy("MockV3Aggregator", {
            from: firstAccount,
            args: [DECIMAL, INITIAL_ANSWER],
            log: true,
        })
    }
}

module.exports.tags = ["all", "mock"]