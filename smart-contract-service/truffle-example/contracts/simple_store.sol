pragma solidity >=0.7.0 <0.9.0;

contract SimpleStore {
    uint number;

    constructor() {}

    function set_number(uint _number) public {
        number = _number;
    }

    // return a string
    function get_number() public view returns (uint) {
        return number;
    }
}
