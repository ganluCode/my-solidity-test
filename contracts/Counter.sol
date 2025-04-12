// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Counter {
    // 计数器值
    uint256 private count;
    
    // 事件声明
    event Increment(uint256 newCount);
    event Decrement(uint256 newCount);
    
    // 获取当前计数
    function getCount() public view returns (uint256) {
        return count;
    }
    
    // 增加计数
    function increment() public {
        count += 1;
        emit Increment(count);
    }
    
    // 减少计数
    function decrement() public {
        require(count > 0, "Counter cannot be negative");
        count -= 1;
        emit Decrement(count);
    }
    
    // 重置计数
    function reset() public {
        count = 0;
    }
} 