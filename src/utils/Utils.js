import {
  main_url,
  goerli_url,
  tbsc_url,
  bsc_url,
  YunGou2_0_main,
  YunGou2_0_goerli,
  YunGou2_0_tbsc,
  YunGou2_0_bsc,
  YunGouAggregators_bsc,
  YunGouAggregators_main,
  YunGouAggregators_tbsc,
  YunGouAggregators_goerli,
} from "./SystemConfiguration";
import { order_data, order_data_tbsc } from "../testdata/orderdata_yungou";
import { BigNumber, ethers, providers, utils } from "ethers";
import { Decimal } from "decimal.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

const equalityStringIgnoreCase = (string1, string2) => {
  if (string1.toLowerCase() === string2.toLowerCase()) {
    return true;
  } else {
    return false;
  }
};
const getScanURL = async () => {
  let chainId = localStorage.getItem("chainId");
  let scanurl;
  if (chainId == 1) {
    scanurl = main_url;
  } else if (chainId == 5) {
    scanurl = goerli_url;
  } else if (chainId == 97) {
    scanurl = tbsc_url;
  } else if (chainId == 56) {
    scanurl = bsc_url;
  }
  return scanurl;
};

const getYunGouAddress = async () => {
  let chainId = localStorage.getItem("chainId");
  let address;
  if (chainId == 1) {
    address = YunGou2_0_main;
  } else if (chainId == 5) {
    address = YunGou2_0_goerli;
  } else if (chainId == 97) {
    address = YunGou2_0_tbsc;
  } else if (chainId == 56) {
    address = YunGou2_0_bsc;
  }
  return address;
};

const getYunGouAggregatorsAddress = async () => {
  let chainId = localStorage.getItem("chainId");
  let address;
  if (chainId == 1) {
    address = YunGouAggregators_main;
  } else if (chainId == 5) {
    address = YunGouAggregators_goerli;
  } else if (chainId == 97) {
    address = YunGouAggregators_tbsc;
  } else if (chainId == 56) {
    address = YunGouAggregators_bsc;
  }
  return address;
};

const getYunGouAddressAndParameters = async (chainId) => {
  let YG_Address;
  let parameters;
  if (chainId == 1) {
    YG_Address = YunGou2_0_main;
    parameters = order_data.parameters;
  } else if (chainId == 5) {
    YG_Address = YunGou2_0_goerli;
    parameters = order_data.parameters;
  } else if (chainId == 97) {
    YG_Address = YunGou2_0_tbsc;
    parameters = order_data_tbsc.parameters;
  } else if (chainId == 56) {
    YG_Address = YunGou2_0_tbsc;
    parameters = order_data_tbsc.parameters;
  }
  return [YG_Address, parameters];
};
const getYunGouAddressAndOrder = async (chainId) => {
  let YG_Address;
  let order;
  if (chainId == 1) {
    YG_Address = YunGou2_0_main;
    order = order_data;
  } else if (chainId == 5) {
    YG_Address = YunGou2_0_goerli;
    order = order_data;
  } else if (chainId == 97) {
    YG_Address = YunGou2_0_tbsc;
    order = order_data_tbsc;
  } else if (chainId == 56) {
    YG_Address = YunGou2_0_tbsc;
    order = order_data_tbsc;
  }
  return [YG_Address, order];
};
const isAddress = (address) => {
  return utils.isAddress(address);
};

// 将一个字符串解池化为一个数组 “[1,2,3]” => [1,2,3]

const stringToArray = (string) => {
  if (string == "[]" || string == "") return [];
  const hexStringArray = string.substring(1, string.length - 1).split(",");
  const stringArray = hexStringArray.map((hexString) => {
    return hexString.trim(); // 去掉前后的空格
  });
  return stringArray;
};

const getDecimal = (bigNumber, decimals) => {
  return Number(ethers.utils.formatUnits(bigNumber, decimals));
};

const getDecimalBigNumber = (number, decimals) => {
  return ethers.utils.parseUnits(number, decimals);
};
// 将一个合约地址保留前4与后4位

const getExtractAddress = (address) => {
  let str = String(address);
  if (str == "null") {
    return "null";
  }
  return (
    str.substring(0, 6) + "..." + str.substring(str.length - 4, str.length)
  );
};

// Convert UTF-8 to bytes string
const utf8ToHexBytes = (str) => {
  const bytes = ethers.utils.toUtf8Bytes(str);

  const hexString = ethers.utils.hexlify(bytes);
  return hexString;
};

const caculatePriceBySqrtPriceX96 = (sqrtPriceX96_) => {
  let sqrtPriceX96 = BigNumber.from(sqrtPriceX96_);
  let sqrtPriceX96_m2 = sqrtPriceX96.mul(sqrtPriceX96).toString();
  let _X_m2_192 = BigNumber.from("2").pow(192).toString();
  // console.log(new Decimal(sqrtPriceX96_m2));
  let price_y_x = new Decimal(sqrtPriceX96_m2)
    .div(new Decimal(_X_m2_192))
    .toNumber();
  console.log(typeof price_y_x);
  let price_x_y = 1 / price_y_x;
  console.log(typeof price_x_y);
  return price_y_x + " or " + price_x_y;
};

function getAddressCreate(sender, nonce) {
  // from + nonce
  let address = ethers.utils.getContractAddress({ from: sender, nonce: nonce });
  return address;
}

async function getAssociatedAddress(mintAddress, ownerAddress) {
  return (
    await getAssociatedTokenAddress(
      new PublicKey(mintAddress),
      new PublicKey(ownerAddress)
    )
  ).toString();
}

export {
  equalityStringIgnoreCase,
  getScanURL,
  getYunGouAddress,
  getYunGouAddressAndParameters,
  getYunGouAddressAndOrder,
  isAddress,
  stringToArray,
  getYunGouAggregatorsAddress,
  getDecimal,
  getDecimalBigNumber,
  getExtractAddress,
  utf8ToHexBytes,
  caculatePriceBySqrtPriceX96,
  getAddressCreate,
  getAssociatedAddress,
};
