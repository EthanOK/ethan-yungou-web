const Web3 = require("web3");
const web3 = new Web3(); // You can also pass a provider URL here

// Your uint256 value
const uintValue = "10";

// Encode the uint256 value
const encodedValue = web3.eth.abi.encodeParameter("uint256", uintValue);

console.log("Encoded Value:", encodedValue);

const prex = "0xddc24be3";

const postx = prex + encodedValue.substring(2);

console.log("Postx:", postx);
