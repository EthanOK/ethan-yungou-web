import { ethers } from "ethers";
import { equalityStringIgnoreCase } from "./Utils";

// Keccak-256("yungou.io") = 0xba6d2ab102481cc9032426c704c58df5594a14a433ff7ca084e4bd32c9196783
const YunGou_Suffix = "0xba6d2ab1";

const addSuffixOfTxData = async (inputData, suffixData) => {
  let newTXData = ethers.utils.hexConcat([inputData, suffixData]);
  return newTXData;
};
const getNewTx = async (
  signer,
  contractAddress,
  inputData,
  suffixData,
  value_wei
) => {
  try {
    let newTXData = ethers.utils.hexConcat([inputData, suffixData]);
    const tx = await signer.sendTransaction({
      to: contractAddress,
      data: newTXData,
      value: value_wei
    });
    return tx;
  } catch (error) {
    // console.log(error);
    if (error.code == -32000) {
      alert(error.message);
    } else if (equalityStringIgnoreCase(error.code, "ACTION_REJECTED")) {
      alert("User Rejected Transaction");
    }
    return null;
  }
};

export { addSuffixOfTxData, getNewTx };
