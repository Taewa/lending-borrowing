// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;

import "./FakeUSDC.sol";

contract LendingBorrowing {
    FakeUSDC immutable usdcContract;
    // depositor => NFT => quantity
    mapping (address => mapping (uint256 => uint256)) public depositList;

    event Deposit(address indexed depositor, uint256 nftTokenId);
    event Borrow(address indexed borrower, uint256 usdcAmount);

    constructor(FakeUSDC _usdcContract) {
        usdcContract = _usdcContract;
    }

    function lendAndBorrow(uint256 _nftTokenId) external {
        //NOTE: To simplify the logic, this is considered as deposit a NFT
        depositNFT(_nftTokenId);
        
        //NOTE: To simplify the logic, always add 1
        borrowUSDC(msg.sender, 1);
    }

    /**
    call this fn with NFT id to borrow USDC
     */
    function depositNFT(uint256 _nftTokenId) private {
        //NOTE: To simplify the logic, always add 1
        depositList[msg.sender][_nftTokenId] += 1;

        emit Deposit(msg.sender, _nftTokenId);
    }

    /**
    based on deposited NFT, USDC will be sent
     */
    function borrowUSDC(address _to, uint256 _amount) private {
        //NOTE: To simplify the logic, always 1 NFT == 1000 USDC 
        usdcContract.transfer(_to, 1000);

        emit Borrow(msg.sender, _amount);
    }
}