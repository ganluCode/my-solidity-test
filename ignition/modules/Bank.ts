import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Bank", (m) => {
    // 部署 Bank 合约
    const bank = m.contract("Bank");

    return {
        bank
    };
}); 