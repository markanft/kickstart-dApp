// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    // mapping(uint256 => Request) public requests;
    Request[] public requests;
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public contributors;
    uint256 private numRequests;
    uint256 public contributorsCount;

    modifier restricted() {
        require(
            msg.sender == manager,
            "Only Campaign owner can create requests"
        );
        _;
    }

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(
            msg.value > minimumContribution,
            "contribution is under the minimum contribution limit"
        );
        if (!contributors[msg.sender]) {
            contributors[msg.sender] = true;
            contributorsCount++;
        }
    }

    function createRequest(
        string memory description,
        uint256 value,
        address recipient
    ) public restricted {
        // Request storage r = requests[numRequests++];
        // r.description = description;
        // r.value = value;
        // r.recipient = recipient;
        // r.complete = false;
        // r.approvalCount = 0;
        // requestsCount++;

        Request storage r = requests.push();
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];
        require(contributors[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];

        require(
            request.approvalCount > (contributorsCount / 2),
            "request must have the approval of more than the 50% of the contributors"
        );
        require(!request.complete, "request already completed");

        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            contributorsCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}
