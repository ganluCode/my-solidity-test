import { expect } from "chai";
import { ethers } from "hardhat";
import { Counter } from "../typechain-types";

describe("Counter", function () {
  let counter: Counter;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    // 获取测试账户
    [owner, addr1, addr2] = await ethers.getSigners();

    // 部署合约
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy();
    await counter.waitForDeployment();
  });

  describe("部署", function () {
    it("应该正确部署", async function () {
      expect(await counter.getAddress()).to.be.properAddress;
    });

    it("初始计数应该为 0", async function () {
      expect(await counter.getCount()).to.equal(0);
    });
  });

  describe("increment", function () {
    it("应该增加计数", async function () {
      await counter.increment();
      expect(await counter.getCount()).to.equal(1);
    });

    it("应该触发 Increment 事件", async function () {
      await expect(counter.increment())
        .to.emit(counter, "Increment")
        .withArgs(1);
    });
  });

  describe("decrement", function () {
    it("应该减少计数", async function () {
      // 先增加两次
      await counter.increment();
      await counter.increment();
      
      // 然后减少一次
      await counter.decrement();
      expect(await counter.getCount()).to.equal(1);
    });

    it("当计数为 0 时应该回滚", async function () {
      await expect(counter.decrement())
        .to.be.revertedWith("Counter cannot be negative");
    });

    it("应该触发 Decrement 事件", async function () {
      // 先增加一次
      await counter.increment();
      
      // 然后减少
      await expect(counter.decrement())
        .to.emit(counter, "Decrement")
        .withArgs(0);
    });
  });

  describe("reset", function () {
    it("应该重置计数为 0", async function () {
      // 先增加几次
      await counter.increment();
      await counter.increment();
      await counter.increment();
      
      // 重置
      await counter.reset();
      expect(await counter.getCount()).to.equal(0);
    });
  });

  describe("多账户操作", function () {
    it("不同账户应该能够操作合约", async function () {
      // 使用第一个账户增加
      await counter.connect(addr1).increment();
      expect(await counter.getCount()).to.equal(1);

      // 使用第二个账户增加
      await counter.connect(addr2).increment();
      expect(await counter.getCount()).to.equal(2);

      // 使用第一个账户减少
      await counter.connect(addr1).decrement();
      expect(await counter.getCount()).to.equal(1);
    });
  });
}); 