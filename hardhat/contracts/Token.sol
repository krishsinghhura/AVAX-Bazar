pragma solidity ^0.8.0;

contract Auth {
    address[] public users; //address is the datatype public means that i can call it from outside and users is the variable name

    function signup() public {
        bool check = true;
        for (uint i = 0; i < users.length; i++) {
            if (users[i] == msg.sender) {
                check = false;
            }
        }
        require(check, "User already exists"); //it is like if else if check then contniue else returns the given statement
        users.push(msg.sender);
    }

    function login(address _user) public view returns (bool) {
        for (uint i = 0; i < users.length; i++) {
            if (users[i] == _user) {
                return true;
            }
        }
        return false;
    }
}
