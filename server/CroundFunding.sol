pragma solidity ^0.4.19;

contract Crowdfunding {
    uint256 deadline;
    uint256 goal;
    mapping(address => uint256) pledgeOf;
    address[3] addresses;
    bool moneyClaimed;
    mapping (address => bool) usersSignatures;
    constructor(uint256 numberOfSeconds, uint256 _goal,address[3] _addresses) public {
        deadline = now + (numberOfSeconds * 1 seconds);
        goal = _goal;
        addresses = _addresses;
        moneyClaimed = false;
    }
    function recoverAddress(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) returns(address)
    {
        return ecrecover(msgHash, v, r, s);
    }
    function verify(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s, address _address) returns(bool) {
        return recoverAddress(msgHash,v,r,s) == (_address);
    }
    function pledge() public payable {
        require(now < deadline,"deadline not reached");
        pledgeOf[msg.sender] += msg.value;
    }
    function claimFunds(bytes32 _msgHash, uint8[2] _v, bytes32[2] _r, bytes32[2] _s) public {
        require(!moneyClaimed, "money was already claimed");
        require(address(this).balance >= goal, "goal not reached"); // funding goal met
        require(now >= deadline, "deadline not reached");               // in the withdrawal period
        uint8 counter = 0;
        for (uint8 k=0; k<2; k++)
        {
            address add = recoverAddress(_msgHash, _v[k], _r[k], _s[k]);
            usersSignatures[add] = false;
        }
        usersSignatures[msg.sender] = false;
        for (uint8 i =0; i<2; i++)
        {
            for (uint8 j=0;j < 3; j++)
            {
                if (verify(_msgHash, _v[i], _r[i], _s[i], addresses[j]) == true)
                {
                    //console.log("verified: ", addresses[j]);
                    if (usersSignatures[addresses[j]] == false)
                    {
                        counter++;
                        usersSignatures[addresses[j]] = true;
                    }
                    
                }
            }
        }
        //check if sender address is in the initial address
        for (uint8 t=0; t<3; t++)
        {
            if ((msg.sender == addresses[t]) && (usersSignatures[addresses[t]] == false))
            {
                counter++;
                usersSignatures[addresses[t]] = true;
            }
        }
        require(counter > 2, "did not get enough correct signatures");
        msg.sender.transfer(address(this).balance);
        moneyClaimed = true;
    }

    function getRefund() public {
        require(address(this).balance < goal,"funding reached limit, can not get refund");  // funding goal not met
        require(now >= deadline, "deadline not reached");               // in the withdrawal period
        uint256 amount = pledgeOf[msg.sender];
        pledgeOf[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
}