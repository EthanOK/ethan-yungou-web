const ethers = require("ethers");

const hexString =
  "0xe59388e59388efbc8ce4bda0e5b7b2e7bb8fe8a2abe68891e79bafe4b88ae4ba86efbc8ce5b08fe5bf83e782b9efbc81";

// Convert hex string to bytes
const bytes = ethers.utils.arrayify(hexString);

// Convert bytes to UTF-8 string
const utf8String = ethers.utils.toUtf8String(bytes);
console.log(utf8String);
// Convert UTF-8 to bytes string

let haha = "哈哈，你已经被我盯上了，小心点！";

const bytes2 = ethers.utils.toUtf8Bytes(haha);
// Convert bytes to hex string

const hexString2 = ethers.utils.hexlify(bytes2);

console.log(hexString2);

console.log(hexString2 == hexString);
