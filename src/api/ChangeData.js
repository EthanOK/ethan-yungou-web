import { ethers, utils } from "ethers";
import { React_Serve_Back, main_rpc } from "../utils/SystemConfiguration.js";
import { login } from "../utils/ServeBack.js";
let url = React_Serve_Back;

const changeCrossChainDatas = async (chainId, ccType, amount, toChainId) => {
  let userToken = localStorage.getItem("token") || "";
  let requestParameters = {
    chainId: chainId,
    ccType: ccType,
    amount: amount,
    toChainId: toChainId
  };
  let result = await fetch(`${url}/api/changeCrossChainDatas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Token": userToken
    },

    body: JSON.stringify(requestParameters)
  });
  let result_json = result.json();
  return result_json;
};

export { changeCrossChainDatas };
