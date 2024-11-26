const { BigNumber } = require("ethers");

let orderType = 0;
let offerer = "0x6278a1e803a76796a3a1f7f6344fe874ebfe94b2";
let offerToken = "0xeaafcc17f28afe5cda5b3f76770efb7ef162d20b";
let offerTokenId = BigNumber.from("8");
let unitPrice = BigNumber.from("10000000000000000");
let sellAmount = 1;
let startTime = 1686286200;
let endTime = 1686986200;
let paymentToken = "0x0000000000000000000000000000000000000000";
let paymentTokenId = 0;
let royaltyFee = BigNumber.from("250000000000000");
let platformFee = BigNumber.from("250000000000000");
let afterTaxPrice = BigNumber.from("9500000000000000");

let parameters_8 = {
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
  salt: 88,
  royaltyFee: royaltyFee,
  platformFee: platformFee,
  afterTaxPrice: afterTaxPrice
};
let parameters_7 = {
  orderType: orderType,
  offerer: offerer,
  offerToken: offerToken,
  offerTokenId: BigNumber.from("7"),
  unitPrice: unitPrice,
  sellAmount: sellAmount,
  startTime: startTime,
  endTime: endTime,
  paymentToken: paymentToken,
  paymentTokenId: paymentTokenId,
  salt: 77,
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
let orderSignature_7 =
  "0x20eb8fcfe0991b0aa4441e250c9c51d42c65eae9c44389e02b9a45f771d640f01dab7b92f660e0f0c77e9baeb6e0bc088b557957c987c1e1ac32f4379d9fd31c1b";
let orderSignature_8 =
  "0xab3048141c5f3afbeacf507aed5cfbd4627729b53c633f9728dbc9bc88b4a5416378e64b7fb82eed1b6cdca294ecb45c8975e59fca8f60871a8817e2fc98d7891b";
let buyAmount = 1;
let totalRoyaltyFee = BigNumber.from("250000000000000");
let totalPlatformFee = BigNumber.from("250000000000000");
let totalAfterTaxIncome = BigNumber.from("9500000000000000");
let totalPayment = BigNumber.from("10000000000000000");
let expiryDate = 1686986400;
let systemSignature_7 =
  "0xb55b71bbb4599d2cb68da7311aff64ee9398f994ffd15e7bc65d95b280f9cf8460d161ee426d360bc14b2c67ed4c9c334d337d37c508197bb83b87dab0ee0b321b";
let systemSignature_8 =
  "0x34039be325e3461375c05ffcf1dd7d63588ff71b31179b7f0ac91edcae1c86fa6a85c458bfac3f4e17776dc4df55f2b1c42b0baf58f5cc88765ef562bde1cb1e1c";

let order_7 = {
  parameters: parameters_7,
  orderSignature: orderSignature_7,
  buyAmount: buyAmount,
  totalRoyaltyFee: totalRoyaltyFee,
  totalPlatformFee: totalPlatformFee,
  totalAfterTaxIncome: totalAfterTaxIncome,
  totalPayment: totalPayment,
  expiryDate: expiryDate,
  systemSignature: systemSignature_7
};
let order_8 = {
  parameters: parameters_8,
  orderSignature: orderSignature_8,
  buyAmount: buyAmount,
  totalRoyaltyFee: totalRoyaltyFee,
  totalPlatformFee: totalPlatformFee,
  totalAfterTaxIncome: totalAfterTaxIncome,
  totalPayment: totalPayment,
  expiryDate: expiryDate,
  systemSignature: systemSignature_8
};

let orders = [];
orders.push(order_7);
// orders.push(order_8);

export default { orders };
