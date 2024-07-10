// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract VotingAndFunding {
    struct Candidate {
        string name;
        address payable wallet;
        uint256 votes;
        uint256 funds;
    }

    mapping(address => bool) public voters;
    mapping(uint256 => Candidate) public candidates;
    uint256 public candidatesCount;

    AggregatorV3Interface internal priceFeed;

    event VoteCast(address voter, uint256 candidateId);
    event FundsTransferred(address sender, uint256 candidateId, uint256 amount);

    constructor() {
        priceFeed = AggregatorV3Interface(0x0567F2323251f0Aab15c8DFb1967E4e8A7D42aeE); // BNB/USD
    }

    function addCandidate(string memory name, address payable wallet) public {
        candidates[candidatesCount] = Candidate(name, wallet, 0, 0);
        candidatesCount++;
    }

    function vote(uint256 candidateId) public {
        require(!voters[msg.sender], "You have already voted.");
        require(candidateId < candidatesCount, "Invalid candidate.");

        voters[msg.sender] = true;
        candidates[candidateId].votes++;

        emit VoteCast(msg.sender, candidateId);
    }

    function fundCandidate(uint256 candidateId) public payable {
        require(candidateId < candidatesCount, "Invalid candidate.");

        uint256 amountInInr = convertBtcToInr(msg.value);
        candidates[candidateId].wallet.transfer(amountInInr);
        candidates[candidateId].funds += amountInInr;

        emit FundsTransferred(msg.sender, candidateId, amountInInr);
    }

    function convertBtcToInr(uint256 btcAmount) public view returns (uint256) {
        (, int256 price,,,) = priceFeed.latestRoundData();
        uint256 btcPriceInUsd = uint256(price);
        uint256 inrPerUsd = 75; // Example rate: 1 USD = 75 INR
        uint256 btcPriceInInr = btcPriceInUsd * inrPerUsd;
        return btcAmount * btcPriceInInr / 1e8; // Adjusting for 8 decimal places of the BTC price
    }

    function getCandidate(uint256 candidateId) public view returns (string memory, uint256, uint256) {
        require(candidateId < candidatesCount, "Invalid candidate.");
        Candidate storage candidate = candidates[candidateId];
        return (candidate.name, candidate.votes, candidate.funds);
    }
}
