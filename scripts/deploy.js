const hre = require("hardhat");

async function main() {
  // 设置解锁时间为部署后 1 小时
  const currentTime = Math.floor(Date.now() / 1000);
  const unlockTime = currentTime + 3600; // 1小时后

  console.log("部署 Lock 合约...");
  console.log("解锁时间:", new Date(unlockTime * 1000).toLocaleString());

  // 部署合约
  const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
    value: hre.ethers.parseEther("0.1"), // 发送 0.1 ETH
  });

  // 等待合约部署完成
  await lock.waitForDeployment();

  // 获取合约地址
  const address = await lock.getAddress();
  console.log("Lock 合约已部署到:", address);
  console.log("解锁时间:", await lock.unlockTime());
  console.log("合约所有者:", await lock.owner());
}

// 执行部署
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 