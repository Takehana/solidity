pragma solidity ^0.4.19;

contract Simplef3d {

    uint public startTime; //time when round is started
    uint public endTime; //time when round should be ended
    address public key_holder; //address of the key holder
    address public host; //address of who deploy the contract
    uint public roundNumber; //shows the nth round
 
    //default constructor, set an endTime for the round to begin with
    function Simplef3d() public payable {
        host = msg.sender;
        
        startTime = now;
        endTime = now + 1 days;
        roundNumber = 1;
    }
    
    //modifier to assert the round is still running
    modifier checkStat() {
        require (now < endTime);
        _;
    }
    
    //player buy a key, cost 1 ether, extend the end time for 5 minutes
    //then enter a 5% chance to get airdrop, which give 1% of the current prize pool
    //
    //players cannot buy another key if they already is the current key holder
    //and player have to have enough funds to be able to buy
    function buy() public payable checkStat {
        require (msg.sender != key_holder);
        require (msg.value == .1 ether);
        
        key_holder = msg.sender;
        endTime += 5 minutes;
        airdrop();
        
    }
    
    //pesudo random int from 0 to 100, if < 5 then give out the airdrop prize
    function airdrop() private {
        if (rng() % 100 <= 5) {
            key_holder.transfer(this.balance / 100);
        }
    }
    
    //simple random int  :(
    function rng() private view returns (uint) {
        return uint (keccak256(block.difficulty, now));
    }
    
    //distribute the prize if the countdown ended
    function endOfRound() public {
        require(now > endTime);
        if (this.balance > 0) {
            key_holder.transfer(this.balance);
        }

        //start a new round by setting all to default
        startTime = now;
        endTime = now + 1 days;
        roundNumber += 1;
    }
    
    //helper function just for the ease of testing
    function getTime() public view returns (uint) {
        return now;
    }
    
    function prizePool() public view returns (uint) {
        return this.balance;
    }

    function getKeyHolder() public view returns (address) {
        return key_holder;
    }
}