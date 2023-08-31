// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract Transactions{
    uint256 transactionCount;

    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    struct Memo{
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    Memo[] memos;

    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public {
        transactionCount+=1;
        memos.push(Memo(msg.sender, receiver, amount, message, block.timestamp, keyword) );

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    function getAllTransactions() public view returns(Memo[] memory){
        return memos;
    }

    function getTransactionCount() public view returns(uint256){
        return transactionCount;
    }

}

// 0xb95FC92fce126125dc2538Db48EAabE41a4979Fe deployed address