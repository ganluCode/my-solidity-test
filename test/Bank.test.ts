import { expect } from "chai";
import { ethers } from "hardhat";
import { Bank } from "../typechain-types";

describe("Bank", function () {
  let bank: Bank;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    // 获取测试账户
    [owner, addr1, addr2] = await ethers.getSigners();

    // 部署合约
    const Bank = await ethers.getContractFactory("Bank");
    bank = await Bank.deploy();
    await bank.waitForDeployment();
  });

  describe("部署", function () {
    it("应该正确部署", async function () {
      expect(await bank.getAddress()).to.be.properAddress;
    });

    it("初始余额应该为 0", async function () {
      expect(await bank.getBalance()).to.equal(0);
    });
  });

  describe("存款", function () {
    it("应该能够存款", async function () {
      const depositAmount = ethers.parseEther("1.0");
      await bank.connect(addr1).deposit({ value: depositAmount });
      expect(await bank.getBalanceOf(addr1.address)).to.equal(depositAmount);
    });

    it("存款金额必须大于0", async function () {
      await expect(bank.connect(addr1).deposit({ value: 0 }))
        .to.be.revertedWith("存款金额必须大于0");
    });

    it("应该触发 Deposit 事件", async function () {
      const depositAmount = ethers.parseEther("1.0");
      await expect(bank.connect(addr1).deposit({ value: depositAmount }))
        .to.emit(bank, "Deposit")
        .withArgs(addr1.address, depositAmount);
    });
  });

  describe("取款", function () {
    beforeEach(async function () {
      // 先存入一些 ETH
      await bank.connect(addr1).deposit({ value: ethers.parseEther("1.0") });
    });

    it("应该能够取款", async function () {
      const withdrawAmount = ethers.parseEther("0.5");
      await bank.connect(addr1).withdraw(withdrawAmount);
      expect(await bank.getBalanceOf(addr1.address)).to.equal(ethers.parseEther("0.5"));
    });

    it("取款金额必须大于0", async function () {
      await expect(bank.connect(addr1).withdraw(0))
        .to.be.revertedWith("取款金额必须大于0");
    });

    it("余额不足时应该回滚", async function () {
      const withdrawAmount = ethers.parseEther("2.0");
      await expect(bank.connect(addr1).withdraw(withdrawAmount))
        .to.be.revertedWith("余额不足");
    });

    it("应该触发 Withdraw 事件", async function () {
      const withdrawAmount = ethers.parseEther("0.5");
      await expect(bank.connect(addr1).withdraw(withdrawAmount))
        .to.emit(bank, "Withdraw")
        .withArgs(addr1.address, withdrawAmount);
    });
  });

  describe("转账", function () {
    beforeEach(async function () {
      // 先存入一些 ETH
      await bank.connect(addr1).deposit({ value: ethers.parseEther("1.0") });
    });

    it("应该能够转账", async function () {
      const transferAmount = ethers.parseEther("0.5");
      await bank.connect(addr1).transfer(addr2.address, transferAmount);
      expect(await bank.getBalanceOf(addr1.address)).to.equal(ethers.parseEther("0.5"));
      expect(await bank.getBalanceOf(addr2.address)).to.equal(transferAmount);
    });

    it("转账金额必须大于0", async function () {
      await expect(bank.connect(addr1).transfer(addr2.address, 0))
        .to.be.revertedWith("转账金额必须大于0");
    });

    it("余额不足时应该回滚", async function () {
      const transferAmount = ethers.parseEther("2.0");
      await expect(bank.connect(addr1).transfer(addr2.address, transferAmount))
        .to.be.revertedWith("余额不足");
    });

    it("应该触发 Transfer 事件", async function () {
      const transferAmount = ethers.parseEther("0.5");
      await expect(bank.connect(addr1).transfer(addr2.address, transferAmount))
        .to.emit(bank, "Transfer")
        .withArgs(addr1.address, addr2.address, transferAmount);
    });
  });
}); 