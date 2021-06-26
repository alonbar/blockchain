pragma solidity ^0.5.1;

contract Crowdfunding {
    uint256 deadline;
    uint256 goal;
    mapping(address => uint256) pledgeOf;
    address[3] addresses;
    constructor(uint256 numberOfSeconds, uint256 _goal,address[3] _addresses) public {
        deadline = now + (numberOfSeconds * 1 seconds);
        goal = _goal;
        addresses = _addresses;
    }
    function verify(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s, address _address) constant returns(bool) {
        return ecrecover(msgHash, v, r, s) == (_address);
    }
    function pledge() public payable {
        require(now < deadline,"deadline not reached");
        pledgeOf[msg.sender] += msg.value;
    }

    function claimFunds(bytes32[2] _msgHash, uint8[2] _v, bytes32[2] _r, bytes32[2] _s) public {
        //todo, add two keys
        require(address(this).balance >= goal, "goal not reached"); // funding goal met
        require(now >= deadline, "deadline not reached");               // in the withdrawal period
        uint8 counter = 0;
        for (uint8 i =0; i<2; i++)
        {
            for (uint8 j=0;j < 3; j++)
            {
                if (verify(_msgHash[i], _v[i], _r[i], _s[i], addresses[j]) == true)
                {
                    console.log("verified: ", addresses[j]);
                    counter++;
                }
            }
        }
        require(counter > 1, "did not get enough correct signatures");
        msg.sender.transfer(address(this).balance);
    }

    function getRefund() public {
        require(address(this).balance < goal,"funding reached limit, can not get refund");  // funding goal not met
        require(now >= deadline, "deadline not reached");               // in the withdrawal period
        uint256 amount = pledgeOf[msg.sender];
        pledgeOf[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
}