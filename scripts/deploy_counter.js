const hre = require("hardhat");

async function main() {
  console.log("部署 Counter 合约...");

  // 部署合约
  const counter = await hre.ethers.deployContract("Counter");

  // 等待合约部署完成
  await counter.waitForDeployment();

  // 获取合约地址
  const address = await counter.getAddress();
  console.log("Counter 合约已部署到:", address);
  
  // 获取初始计数
  const initialCount = await counter.getCount();
  console.log("初始计数:", initialCount);
}

// 执行部署
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 