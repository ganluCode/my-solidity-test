const hre = require("hardhat");

async function main() {
  console.log("部署 Bank 合约...");

  // 部署合约
  const bank = await hre.ethers.deployContract("Bank");

  // 等待合约部署完成
  await bank.waitForDeployment();

  // 获取合约地址
  const address = await bank.getAddress();
  console.log("Bank 合约已部署到:", address);
}

// 执行部署
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 