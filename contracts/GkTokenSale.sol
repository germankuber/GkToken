pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

interface GkTokenInterface {
    function decimals() external view returns (uint8);

    function balanceOf(address _address) external view returns (uint256);

    function transfer(address _to, uint256 _value)
        external
        returns (bool success);
}

contract GkTokenSale {
    using SafeMath for uint256;
    address owner;
    uint256 price;
    GkTokenInterface gkToken;
    uint256 tokenSold;

    event Sold(address _buyer, uint256 amount);

    constructor(uint256 _price, address _gkToken) {
        owner = msg.sender;
        price = _price;
        gkToken = GkTokenInterface(_gkToken);
    }

    function buy(uint256 _numTokens) public payable {
        require(
            msg.value == _numTokens.mul(_numTokens),
            "The amount is different"
        );
        uint256 scaleAmount = _numTokens.mul(uint256(1)**gkToken.decimals());
        require(
            gkToken.balanceOf(address(this)) >= scaleAmount,
            "The contract does not have enough tokens"
        );
        tokenSold += _numTokens;
        require(gkToken.transfer(msg.sender, scaleAmount));
        emit Sold(msg.sender, _numTokens);
    }

    function endSold() public payable {
        require(msg.sender == owner, "Only the owner can execute this method");
        require(gkToken.transfer(owner, gkToken.balanceOf(address(this))));
        payable(msg.sender).transfer(address(this).balance);
    }
}
