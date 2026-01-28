// import ethers.js
// create main function
// execute main function

const { ethers } = require("hardhat");
// import { verifyContract } from "@nomicfoundation/hardhat-verify/verify";

async function main() {
  

  
}

async function verifyFundMe(fundMeAddr, args) {
  await hre.run("verify:verify", {
    address: fundMeAddr,
    constructorArguments: args,
  });
}

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
