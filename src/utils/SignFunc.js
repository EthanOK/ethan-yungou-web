import { BigNumber, ethers, providers, utils } from "ethers";
import { getSigner } from "./GetProvider";
import { _TypedDataEncoder, TypedDataEncoder } from "@ethersproject/hash";
import {
  equalityStringIgnoreCase,
  getYunGouAddressAndParameters
} from "./Utils";
import {
  YunGou2_0_main,
  YunGou2_0_goerli,
  YunGou2_0_tbsc,
  PRIVATEKEY_VERIFYER
} from "./SystemConfiguration";
import {
  getSignerAndChainId,
  getSignerAndAccountAndChainId
} from "./GetProvider";
import { order_data, order_data_tbsc } from "../testdata/orderdata_yungou";
import { Seaport } from "@opensea/seaport-js";

const signEIP712Message = async (signer, chainId) => {
  try {
    const [signer_, chainId_] = await getSignerAndChainId();
    const types = {
      VerifyClaim: [
        { name: "userAddress", type: "address" },
        { name: "randNo", type: "uint256" },
        { name: "amount", type: "uint256" }
      ]
    };
    const domainData = {
      name: "YunGou DApp",
      version: "2",
      chainId: parseInt(chainId_, 10),
      verifyingContract: "0x0000006c517ed32ff128b33f137bb4ac31b0c6dd"
    };
    const randNo = utils.hexlify(utils.randomBytes(8));
    const amount = utils.hexlify(utils.randomBytes(1));
    // 获取签名者的地址
    console.log(signer_);
    const signerAddress = await signer_.getAddress();

    var message = {
      userAddress: signerAddress,
      randNo: randNo,
      amount: amount
    };

    // TODO:_signTypedData
    console.log("_signTypedData");
    const signature = await signer_._signTypedData(domainData, types, message);

    const recoveredAddress = ethers.utils.verifyTypedData(
      domainData,
      types,
      message,
      signature
    );

    if (recoveredAddress === signerAddress) {
      console.log("签名验证成功！");
    } else {
      console.log("签名验证失败！");
    }
    const params = { domainData, message, signature };
    return params;
  } catch (error) {
    console.log(error);
    if (equalityStringIgnoreCase(error.code, "ACTION_REJECTED")) {
      alert("User Rejected Transaction");
    }
    if (error.code == -32000) {
      alert(error.message);
    }
    return null;
  }
};
const signStringMessage = async (signer) => {
  // TODO: signMessage String
  console.log("signMessage String");
  let messageString = "Hello, this is a String Message.";

  try {
    const signatureM = await signer.signMessage(messageString);
    console.log(signatureM);
    const recoveredAddressString = ethers.utils.verifyMessage(
      messageString,
      signatureM
    );
    const signerAddress = await signer.getAddress();
    if (recoveredAddressString === signerAddress) {
      console.log("签名验证成功！");
    } else {
      console.log("签名验证失败！");
    }
    return true;
  } catch (error) {
    console.log(error);
    if (equalityStringIgnoreCase(error.code, "ACTION_REJECTED")) {
      alert("User Rejected Transaction");
    }
    if (error.code == -32000) {
      alert(error.message);
    }
    return false;
  }
};
const signHexDataMessage = async (signer, hexData) => {
  // TODO: signMessage 十六进制数据
  console.log("signMessage Hex data");
  // 将十六进制数据转换为字节数组
  console.log(hexData);
  // const hexData =
  //   "0xf6896007477ab25a659f87c4f8c5e3baac32547bf305e77aa57743046e10578b";
  const data = ethers.utils.arrayify(hexData);

  try {
    const signatureHex = await signer.signMessage(data);
    console.log(signatureHex);
    const signerAddress = await signer.getAddress();
    const recoveredAddressHex = ethers.utils.verifyMessage(data, signatureHex);
    if (recoveredAddressHex === signerAddress) {
      console.log("签名验证成功！");
    } else {
      console.log("签名验证失败！");
    }
    return signatureHex;
  } catch (error) {
    console.log(error);
    if (equalityStringIgnoreCase(error.code, "ACTION_REJECTED")) {
      alert("User Rejected Transaction");
    }
    if (error.code == -32000) {
      alert(error.message);
    }
    return null;
  }
};
const signEIP712YunGouMessage = async (signer, chainId) => {
  const [YG_Address, message] = await getYunGouAddressAndParameters(chainId);

  const domainData = {
    name: "YunGou",
    version: "2.0",
    chainId: chainId,
    verifyingContract: YG_Address
  };

  const types = {
    BasicOrderParameters: [
      { name: "orderType", type: "uint8" },
      { name: "offerer", type: "address" },
      { name: "offerToken", type: "address" },
      { name: "offerTokenId", type: "uint256" },
      { name: "unitPrice", type: "uint256" },
      { name: "sellAmount", type: "uint256" },
      { name: "startTime", type: "uint256" },
      { name: "endTime", type: "uint256" },
      { name: "paymentToken", type: "address" },
      { name: "paymentTokenId", type: "uint256" },
      { name: "salt", type: "uint256" },
      { name: "royaltyFee", type: "uint256" },
      { name: "platformFee", type: "uint256" },
      { name: "afterTaxPrice", type: "uint256" }
    ]
  };

  console.log(message);

  // TODO:_signTypedData
  console.log("_signTypedData");

  try {
    const orderSignature = await signer._signTypedData(
      domainData,
      types,
      message
    );

    console.log("orderSignature:" + orderSignature);
    let data = order_data;

    let systemSignature = await getSystemSignature(orderSignature, data);
    console.log("systemSignature:" + systemSignature);

    // _hashTypedDataV4(keccak256(abi.encode(TYPE_HASH, parameters)))
    // let hash_ = _TypedDataEncoder.hash(domainData, types, message);

    // keccak256(abi.encode(TYPE_HASH, parameters))
    let orderHash = _TypedDataEncoder.from(types).hash(message);

    console.log("orderHash: " + orderHash);
    let result = {
      orderHash: orderHash,
      orderSignature: orderSignature,
      systemSignature: systemSignature
    };
    return result;
  } catch (error) {
    console.log(error);

    if (error.code == 500) {
      alert(error.message);
    } else if (equalityStringIgnoreCase(error.code, "ACTION_REJECTED")) {
      alert("User Rejected Transaction");
    } else if (error.code == -32000) {
      alert(error.message);
    }
    return false;
  }
};

const signEIP712OpenSeaMessage = async (signer, chainId) => {
  const domainData = {
    name: "Seaport",
    version: "1.5",
    chainId: chainId,
    verifyingContract: "0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC"
  };

  console.log(domainData);
  //   struct BasicOrderParameters {
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
  //     uint256 salt;
  //     uint256 royaltyFee;
  //     uint256 platformFee;
  //     uint256 afterTaxPrice;
  // }
  const types = {
    OrderComponents: [
      {
        name: "offerer",
        type: "address"
      },
      {
        name: "zone",
        type: "address"
      },
      {
        name: "offer",
        type: "OfferItem[]"
      },
      {
        name: "consideration",
        type: "ConsiderationItem[]"
      },
      {
        name: "orderType",
        type: "uint8"
      },
      {
        name: "startTime",
        type: "uint256"
      },
      {
        name: "endTime",
        type: "uint256"
      },
      {
        name: "zoneHash",
        type: "bytes32"
      },
      {
        name: "salt",
        type: "uint256"
      },
      {
        name: "conduitKey",
        type: "bytes32"
      },
      {
        name: "counter",
        type: "uint256"
      }
    ],
    OfferItem: [
      {
        name: "itemType",
        type: "uint8"
      },
      {
        name: "token",
        type: "address"
      },
      {
        name: "identifierOrCriteria",
        type: "uint256"
      },
      {
        name: "startAmount",
        type: "uint256"
      },
      {
        name: "endAmount",
        type: "uint256"
      }
    ],
    ConsiderationItem: [
      {
        name: "itemType",
        type: "uint8"
      },
      {
        name: "token",
        type: "address"
      },
      {
        name: "identifierOrCriteria",
        type: "uint256"
      },
      {
        name: "startAmount",
        type: "uint256"
      },
      {
        name: "endAmount",
        type: "uint256"
      },
      {
        name: "recipient",
        type: "address"
      }
    ]
  };

  let message = {
    offerer: "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2",
    zone: "0x004C00500000aD104D7DBd00e3ae0A5C00560C00",
    offer: [
      {
        itemType: 2,
        token: "0x97f236E644db7Be9B8308525e6506E4B3304dA7B",
        identifierOrCriteria: BigNumber.from("111"),
        startAmount: BigNumber.from("1"),
        endAmount: BigNumber.from("1")
      }
    ],
    consideration: [
      {
        itemType: 0,
        token: "0x0000000000000000000000000000000000000000",
        identifierOrCriteria: BigNumber.from("0"),
        startAmount: BigNumber.from("1082250000000000000"),
        endAmount: BigNumber.from("1082250000000000000"),
        recipient: "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2"
      },
      {
        itemType: 0,
        token: "0x0000000000000000000000000000000000000000",
        identifierOrCriteria: BigNumber.from("0"),
        startAmount: BigNumber.from("27750000000000000"),
        endAmount: BigNumber.from("27750000000000000"),
        recipient: "0x0000a26b00c1F0DF003000390027140000fAa719"
      }
    ],
    orderType: 0,
    startTime: BigNumber.from("1686193412"),
    endTime: BigNumber.from("1688785412"),
    zoneHash:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    salt: BigNumber.from(
      "24446860302761739304752683030156737591518664810215442929818227897836383814680"
    ),
    conduitKey:
      "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
    counter: BigNumber.from("0")
  };
  console.log(message);

  // TODO:_signTypedData
  console.log("_signTypedData");

  try {
    const orderSignature = await signer._signTypedData(
      domainData,
      types,
      message
    );

    console.log("orderSignature:" + orderSignature);

    let orderHash = _TypedDataEncoder.from(types).hash(message);

    console.log("orderHash: " + orderHash);
    let result = {
      orderHash: orderHash,
      orderSignature: orderSignature
    };
    return result;
  } catch (error) {
    console.log(error);
    if (equalityStringIgnoreCase(error.code, "ACTION_REJECTED")) {
      alert("User Rejected Transaction");
    }
    if (error.code == -32000) {
      alert(error.message);
    }
    return false;
  }
};

//TODO:OpenSea 的批量签名
const signBulkOrderOpenSeaMessage = async (signer, chainId) => {
  const seaport = new Seaport(signer);
  const domainData = await seaport._getDomainData();

  console.log(domainData);

  const order = {
    offerer: "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2",
    zone: "0x004C00500000aD104D7DBd00e3ae0A5C00560C00",
    offer: [
      {
        itemType: 2,
        token: "0x97f236E644db7Be9B8308525e6506E4B3304dA7B",
        identifierOrCriteria: BigNumber.from("111"),
        startAmount: BigNumber.from("1"),
        endAmount: BigNumber.from("1")
      }
    ],
    consideration: [
      {
        itemType: 0,
        token: "0x0000000000000000000000000000000000000000",
        identifierOrCriteria: BigNumber.from("0"),
        startAmount: BigNumber.from("1082250000000000000"),
        endAmount: BigNumber.from("1082250000000000000"),
        recipient: "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2"
      },
      {
        itemType: 0,
        token: "0x0000000000000000000000000000000000000000",
        identifierOrCriteria: BigNumber.from("0"),
        startAmount: BigNumber.from("27750000000000000"),
        endAmount: BigNumber.from("27750000000000000"),
        recipient: "0x0000a26b00c1F0DF003000390027140000fAa719"
      }
    ],
    orderType: 0,
    startTime: BigNumber.from("1686193412"),
    endTime: BigNumber.from("1688785412"),
    zoneHash:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    salt: BigNumber.from(
      "24446860302761739304752683030156737591518664810215442929818227897836383814680"
    ),
    conduitKey:
      "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
    counter: BigNumber.from("0")
  };
  const orders = [];
  orders.push(order);
  let ordersWithSign;
  try {
    ordersWithSign = await seaport.signBulkOrder(orders);
  } catch (error) {}

  return ordersWithSign;
};

// getSystemSignature_YunGou
const getSystemSignature = async (orderSignature, data) => {
  try {
    let privateKey = PRIVATEKEY_VERIFYER;
    let signer = new ethers.Wallet(privateKey);

    const type = [
      "bytes",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "uint256"
    ];
    const args = [
      orderSignature,
      data.buyAmount,
      data.totalRoyaltyFee,
      data.totalPlatformFee,
      data.totalAfterTaxIncome,
      data.totalPayment,
      data.expiryDate
    ];

    const encodedData = ethers.utils.defaultAbiCoder.encode(type, args);
    console.log("encodedData:" + encodedData);
    const hashData = ethers.utils.keccak256(encodedData);
    let binaryData_ = ethers.utils.arrayify(hashData);
    console.log("systemMassageHash:" + hashData);
    let signPromise_ = await signer.signMessage(binaryData_);
    return signPromise_;
  } catch (error) {
    console.log(error);
    if (equalityStringIgnoreCase(error.code, "ACTION_REJECTED")) {
      alert("User Rejected Transaction");
    }
    if (error.code == -32000) {
      alert(error.message);
    }
    return false;
  }
};

const signBlurLoginMessage = async (signer, messageString) => {
  console.log(messageString);

  try {
    const signatureM = await signer.signMessage(messageString);
    console.log(signatureM);

    const recoveredAddressString = ethers.utils.verifyMessage(
      messageString,
      signatureM
    );
    const signerAddress = await signer.getAddress();
    if (recoveredAddressString === signerAddress) {
      console.log("签名验证成功！");
    } else {
      console.log("签名验证失败！");
    }
    return signatureM;
  } catch (error) {
    console.log(error);
    if (equalityStringIgnoreCase(error.code, "ACTION_REJECTED")) {
      alert("User Rejected Transaction");
    }
    if (error.code == -32000) {
      alert(error.message);
    }
    return null;
  }
};

export {
  signEIP712Message,
  signStringMessage,
  signHexDataMessage,
  getSystemSignature,
  signEIP712YunGouMessage,
  signEIP712OpenSeaMessage,
  signBlurLoginMessage,
  signBulkOrderOpenSeaMessage
};
