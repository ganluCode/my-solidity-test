// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Bank {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {`
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // 用户余额映射
    mapping(address => uint256) public balances;
    
    // 事件声明
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);
    


    // 存款功能
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    receive() external payable {
      deposit();
    }
    // 取款功能
    function withdraw(uint256 amount) public {
        require(amount > 0, "Withdraw amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    function withdrawAll() public onlyOwner {
      uint b = address(this).balance;
      payable(owner).transfer(b);
    }
    
    // 转账功能
    function transfer(address to, uint256 amount) public {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Transfer amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }
    
    // 查询余额
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
    
    // 查询其他用户余额
    function getBalanceOf(address user) public view returns (uint256) {
        return balances[user];
    }
} 