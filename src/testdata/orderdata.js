const { BigNumber } = require("ethers");

let orderType = 0;
let offerer = "0x6278a1e803a76796a3a1f7f6344fe874ebfe94b2";
let offerToken = "0xeaafcc17f28afe5cda5b3f76770efb7ef162d20b";
let offerTokenId = BigNumber.from("65");
let unitPrice = BigNumber.from("10000000000000000");
let sellAmount = 1;
let startTime = 1686286200;
let endTime = 1718608600;
let paymentToken = "0x0000000000000000000000000000000000000000";
let paymentTokenId = 0;
let salt = 7;
let royaltyFee = BigNumber.from("250000000000000");
let platformFee = BigNumber.from("250000000000000");
let afterTaxPrice = BigNumber.from("9500000000000000");

let parameters = {
  orderType: orderType,
  offerer: offerer,
  offerToken: offerToken,
  offerTokenId: offerTokenId,
  unitPrice: unitPrice,
  sellAmount: sellAmount,
  startTime: startTime,
  endTime: endTime,
  paymentToken: paymentToken,
  paymentTokenId: paymentTokenId,
  salt: salt,
  royaltyFee: royaltyFee,
  platformFee: platformFee,
  afterTaxPrice: afterTaxPrice
};

// // buy it now
// struct BasicOrderParameters {
//     OrderType orderType;
//     address payable offerer;
//     address offerToken;
//     uint256 offerTokenId;
//     uint256 unitPrice;
//     uint256 sellAmount;
//     uint256 startTime;
//     uint256 endTime;
//     address paymentToken;
//     uint256 paymentTokenId;
//     uint256 royaltyFee;
//     uint256 platformFee;
//     uint256 afterTaxPrice;
// }

// let orderSignature =
//   "0x8201adaa013087fa04cd5f382f6b1b7e8a5ddf5ced5a5bbe05ebe973dc9f01f27487ba8bdd11994d50639bf70d6294a710811ff6a55eb7aa5f4948ad1e26fc481b";
let orderSignature =
  "0xa4d4172625469ebfaca424241bc57f025ff061368397f35aa5fa0f75d06bf69738016da2051552e293d1c43b760d6a4c7ee37bf397c1271ed14fe2c3f419bb531c";
let buyAmount = 1;
let totalRoyaltyFee = BigNumber.from("250000000000000");
let totalPlatformFee = BigNumber.from("250000000000000");
let totalAfterTaxIncome = BigNumber.from("9500000000000000");
let totalPayment = BigNumber.from("10000000000000000");
let expiryDate = 1718608600;
// let systemSignature =
//   "0x43fb46f4fccc7df07cf21f7b3b811a13026c9c7cd4d9003d422ddba26b38ccb01d1bea6e15135275cdb4a517100c2f801d44334dad5741ee822c624a9c80cc9a1c";
let systemSignature =
  "0x7a1df88f3e0a03975c685031bce2aa9635cc176984e5774d93d5ddc1903a9857568611530825359bfc1849bed44c31a2b3d8299ff141e42e2ed27f1ae4bbb7e51c";
let order_data = {
  parameters: parameters,
  orderSignature: orderSignature,
  buyAmount: buyAmount,
  totalRoyaltyFee: totalRoyaltyFee,
  totalPlatformFee: totalPlatformFee,
  totalAfterTaxIncome: totalAfterTaxIncome,
  totalPayment: totalPayment,
  expiryDate: expiryDate,
  systemSignature: systemSignature
};

let parameters_tbsc = {
  orderType: orderType,
  offerer: offerer,
  offerToken: "0xF0D6CC43Ff6E35344120c27cB76Cc80E9706803c",
  offerTokenId: "8",
  unitPrice: unitPrice,
  sellAmount: sellAmount,
  startTime: startTime,
  endTime: endTime,
  paymentToken: paymentToken,
  paymentTokenId: paymentTokenId,
  salt: "8",
  royaltyFee: royaltyFee,
  platformFee: platformFee,
  afterTaxPrice: afterTaxPrice
};
let order_data_tbsc = {
  parameters: parameters_tbsc,
  orderSignature:
    "0xce212daad93cc3f9aefc7097e80df689ed3d01bccb7b28f4d39babfc54ba714577ca83979875cddea8b4a290e0d87af54b94e6b4926c9b16f2a4a9ba4effa3c91c",
  buyAmount: buyAmount,
  totalRoyaltyFee: totalRoyaltyFee,
  totalPlatformFee: totalPlatformFee,
  totalAfterTaxIncome: totalAfterTaxIncome,
  totalPayment: totalPayment,
  expiryDate: expiryDate,
  systemSignature:
    "0xfc9220d8c74f8c0ff27d88b370aacf15e8ad281699cbc08641b80166bdc6c14674324fc1d798351d4fc20c325f47f1762b39dcf807355a1715c32201134f7b211c"
};

export default { order_data, order_data_tbsc };
