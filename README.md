# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```


初始化
yarn init
yarn add --dev hardhat
yarn hardhat init (yarn 版本1,hardhat版本3)
选择old版本（2版本） 然后系统会自动帮你安装依赖，以及将你的hardhat版本降到2代

安装env-enc
yarn add --dev @chainlink/env-enc #创建环境变量加密文件
yarn env-enc set 

通过verify验证合约
npx hardhat verify --network sepolia 0x58BD9EA847AD7380348B31506543E3b7bA385BE4 "10" 
国内提示网络问题的话，


ethers 6
获取地址为 fundMe.target