// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


contract CampaignFactory {
    address[] public deployedCampaigns;

    // constructor(uint minContribution) {
    //     address newCampaignAddress = address(new Campaign(minContribution, msg.sender));
    //     deployedCampaigns.push(newCampaignAddress);
    // }


    function createCampaign(uint minContribution) public {
        address newCampaignAddress = address(new Campaign(minContribution, msg.sender));
        deployedCampaigns.push(newCampaignAddress);
    }

    function getAllCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}


contract Campaign {

    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;

        uint approvalCount;
        mapping(address => bool) approvals;

    }

    address payable public manager;
    uint public minContribution;

    uint public numRequests;
    uint public numContributers;

    mapping(address => bool) public approvers;
    mapping (uint => Request) public requests;


    function getSummary() public view returns(
      uint, uint, uint, uint, address
      ) {
      return  (
        minContribution,
        address(this).balance,
        numRequests,
        numContributers,
        manager
        );
    }

    function getRequestsCount() public view returns(uint) {
      return numRequests;
    }


    modifier restricted () {
        require(msg.sender == manager);
        _;
    }

    constructor(uint min_contri, address creatorAddress)  {
        manager = payable(creatorAddress);
        minContribution = min_contri;

    }

    function contribute() public payable {
        require(msg.value > minContribution);
        approvers[msg.sender] = true;
        numContributers++;
    }

    function createRequest(string memory desc, uint  val, address recipient) public restricted {
        Request storage r = requests[numRequests++];
        r.description = desc;
        r.value = val;
        r.recipient = payable(recipient);
        r.complete = false;
        r.approvalCount = 0;

    }

    function approveRequest(uint reqIndex) public {
        require(approvers[msg.sender]);
        require(!requests[reqIndex].approvals[msg.sender]);

        requests[reqIndex].approvals[msg.sender] = true;
        requests[reqIndex].approvalCount++;
    }

    function finalizeRequest(uint reqIndex) public restricted {
        // storage because we want to work on the existing copy of request on the contract
        Request storage request = requests[reqIndex];

        require (request.approvalCount > (numContributers / 2) );
        require (!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;

    }

}
