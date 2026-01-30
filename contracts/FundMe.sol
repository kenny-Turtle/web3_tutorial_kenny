// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// 1.创建一个收款函数
// 2.记录投资人并且查看
// 3.在锁定期内，达到目标值，生产商可以提款
// 4.在锁定期内，没有达到目标值，投资人在锁定期之后退款

contract FundMe {
    mapping(address => uint256) public funders2Amount;

    uint256 constant MINIMUM_VALUE = 10 * 10 ** 18; //wei

    AggregatorV3Interface public dataFeed;

    address public erc20Addr;

    uint256 constant TARGET = 50 * 10 ** 18;

    address public owner;

    uint256 deploymentTimestamp;
    uint256 lockTime;

    bool public getFundSuccess = false;

    constructor(uint256 _lockTime, address dataFeedAddr) {
        owner = msg.sender;
        // sepolia testnet
        dataFeed = AggregatorV3Interface(
            dataFeedAddr
        );
        deploymentTimestamp = block.timestamp;
        lockTime = _lockTime;
    }

    function fund() external payable {
        require(
            block.timestamp < deploymentTimestamp + lockTime,
            "window is close"
        );
        require(convertEthToUsd(msg.value) >= MINIMUM_VALUE, "Send more ETH");
        funders2Amount[msg.sender] += msg.value;
    }

    function getChainlinkDataFeedLatestAnswer() public view returns (int256) {
        // prettier-ignore
        (
      /* uint80 roundId */
      ,
      int256 answer,
      /*uint256 startedAt*/
      ,
      /*uint256 updatedAt*/
      ,
      /*uint80 answeredInRound*/
    ) = dataFeed.latestRoundData();
        return answer;
    }

    function convertEthToUsd(
        uint256 _ethAmount
    ) internal view returns (uint256) {
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        return (_ethAmount * ethPrice) / (10 ** 8);
    }

    function getFund() external windowClose onlyOwner {
        require(
            convertEthToUsd(address(this).balance) >= TARGET,
            "Target is not reached"
        );
        // transfer: transfer ETH and revert if tx failed
        // payable(msg.sender).transfer(address(this).balance);

        // send: transfer ETH and return false if failed
        // bool success = payable(msg.sender).send(address(this).balance);

        // call: transfer ETH with data return value of function and bool
        bool success;
        (success, ) = payable(msg.sender).call{value: address(this).balance}(
            ""
        );
        require(success, "transfer tx failed");
        // 将mapping置空
        funders2Amount[msg.sender] = 0;
        getFundSuccess = true;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    function setErc20Addr(address _erc20Addr) public onlyOwner {
        erc20Addr = _erc20Addr;
    }

    function setFunderToAmount(
        address funder,
        uint256 amountToUpdate
    ) external {
        require(
            msg.sender == erc20Addr,
            "You do not have permission to call this function"
        );
        funders2Amount[funder] = amountToUpdate;
    }

    function refund() external windowClose {
        require(
            convertEthToUsd(address(this).balance) < TARGET,
            "Target is reached"
        );
        require(funders2Amount[msg.sender] != 0, "there is no fund for you");
        bool success;
        (success, ) = payable(msg.sender).call{
            value: funders2Amount[msg.sender]
        }("");
        require(success, "transfer tx failed");
        funders2Amount[msg.sender] = 0;
    }

    modifier windowClose() {
        require(
            block.timestamp >= deploymentTimestamp + lockTime,
            "Funding period has not ended yet"
        );
        _;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "this function can only be called by owner"
        );
        _;
    }
}
