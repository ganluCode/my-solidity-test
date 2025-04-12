// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;

export default buildModule("Lock", (m) => {
  // 设置解锁时间为部署后 1 小时
  const unlockTime = Math.floor(Date.now() / 1000) + 3600;
  
  // 部署 Lock 合约
  const lock = m.contract("Lock", [unlockTime], {
    // 可以在这里设置部署时的 ETH 数量（单位：wei）
    value: m.parseEther("0.1")
  });

  return {
    lock
  };
});
