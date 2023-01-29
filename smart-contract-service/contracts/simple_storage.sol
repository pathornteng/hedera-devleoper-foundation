// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SimpleStorage {
    uint256 data;

    function retrieve() external view returns (uint256) {
        return data;
    }

    function store(uint256 _data) external {
        data = _data;
    }
}
