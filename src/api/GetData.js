import { ethers, utils } from "ethers";
import { React_Serve_Back, main_rpc } from "../utils/SystemConfiguration.js";
import { login } from "../utils/ServeBack.js";
let url = React_Serve_Back;

const getSystemData = async () => {
  let requestParameters = { userAddress: localStorage.getItem("userAddress") };
  let userToken = localStorage.getItem("token") || "";
  let result = await fetch(`${url}/api/getSystemData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Token": userToken
    },

    body: JSON.stringify(requestParameters)
  });
  let result_json = await result.json();

  if (result_json.code == -400) {
    alert("token 过期，请重新登陆");
    return [];
  } else if (result_json.code == -401) {
    alert(result_json.message);
    return [];
  }
  return result_json.data;
};

const getUserToken = async (params) => {
  let requestParameters = params;
  // TODO:

  let result = await fetch(`${url}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(requestParameters)
  });
  let result_json = result.json();

  // let result_json = await login(requestParameters);
  return result_json;
};

const getOrderHashSignatureOpenSea = async (chainId, contract, tokenId) => {
  let userToken = localStorage.getItem("token") || "";
  let requestParameters = {
    chainId: chainId,
    tokenAddress: contract,
    tokenId: tokenId
  };
  let result = await fetch(`${url}/api/getOrderHashSignatureOpenSea`, {
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

const getENSOfAddress = async (address) => {
  let userToken = localStorage.getItem("token") || "";
  let requestParameters = {
    address: address
  };
  let result = await fetch(`${url}/api/getENSOfAddress`, {
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

const getENSOfAddressTheGraph = async (address) => {
  let userToken = localStorage.getItem("token") || "";
  let requestParameters = {
    address: address
  };
  let result = await fetch(`${url}/api/getENSOfAddressTheGraph`, {
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

const getAddressOfENS = async (ens) => {
  let userToken = localStorage.getItem("token") || "";
  let requestParameters = {
    ens: ens
  };
  let result = await fetch(`${url}/api/getAddressOfENS`, {
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

const getAddressOfENSTheGraph = async (ens) => {
  let userToken = localStorage.getItem("token") || "";
  let requestParameters = {
    ens: ens
  };
  let result = await fetch(`${url}/api/getAddressOfENSTheGraph`, {
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

const getNameByTokenIdTheGraph = async (tokenId) => {
  let userToken = localStorage.getItem("token") || "";
  let requestParameters = {
    tokenId: tokenId
  };
  let result = await fetch(`${url}/api/getENSByTokenIdTheGraph`, {
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

const getENSByTokenId = async (tokenId) => {
  let userToken = localStorage.getItem("token") || "";
  let requestParameters = {
    tokenId: tokenId
  };
  let result = await fetch(`${url}/api/getENSByTokenId`, {
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

const getENSOfAddressByContract = async (address) => {
  let userToken = localStorage.getItem("token") || "";
  let requestParameters = {
    address: address
  };
  let result = await fetch(`${url}/api/getENSOfAddressByContract`, {
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

const getCrossChainSignature = async (chainId, ccType, amount) => {
  let userToken = localStorage.getItem("token") || "";
  let requestParameters = {
    chainId: chainId,
    ccType: ccType,
    amount: amount
  };
  let result = await fetch(`${url}/api/getCrossChainSignature`, {
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

const getClaimYGIOBalance = async (chainId) => {
  let userToken = localStorage.getItem("token") || "";
  let requestParameters = {
    chainId: chainId
  };
  let result = await fetch(`${url}/api/getClaimYGIOBalance`, {
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

const getENSUniversalResolver = async (address) => {
  address = utils.getAddress(address);
  const dnsName = address.substring(2).toLowerCase() + ".addr.reverse";
  const reverseName = utils.dnsEncode(dnsName);
  console.log(reverseName);
  let contractABI = [
    "function reverse(bytes reverseName) view returns (string, address, address, address)"
  ];
  const contractInterface = new ethers.utils.Interface(contractABI);
  const data = contractInterface.encodeFunctionData("reverse", [reverseName]);

  let requestParameters = {
    method: "eth_call",
    params: [
      {
        to: "0xc0497e381f536be9ce14b0dd3817cbcae57d2f62",
        data: data
      },
      "latest"
    ],
    id: 44,
    jsonrpc: "2.0"
  };
  console.log(JSON.stringify(requestParameters));
  try {
    let result = await fetch(main_rpc, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(requestParameters)
    });
    let result_json = await result.json();
    console.log(result_json);
    if ("error" in result_json) {
      return { code: 200, data: null };
    } else {
      const abi = ["string", "address", "address", "address"];
      const decodedData = ethers.utils.defaultAbiCoder.decode(
        abi,
        result_json.result
      );
      return { code: 200, data: decodedData[0] };
    }
  } catch (error) {
    console.log(error);
    return { code: 200, data: null };
  }
};

const getPriceBaseUSDT = async () => {
  let result = await fetch(`${url}/api/getPriceBaseUSDT`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });
  let result_json = result.json();
  return result_json;
};

const getPriceBaseUSDTByBinance = async () => {
  let result = await fetch(
    `https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT`,
    {
      method: "GET"
    }
  );
  let result_json = await result.json();
  return { code: 200, data: { ethPrice: result_json.price } };
};

const getBlurLoginMessageByOpensea = async (userAddress) => {
  // 必须 后台访问，前端有跨域限制
  const postURL = "https://api.pro.opensea.io/blur/auth/challenge";
  const data = { address: userAddress };
  try {
    // Make the POST request using the fetch API
    const response = await fetch(postURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    // console.log(response);
    if (response.ok) {
      const responseData = await response.json();
      // console.log(responseData);
      if (responseData.data.toLowerCase() != "Success".toLowerCase()) {
        return null;
      }

      return responseData;
    } else {
      console.log(response.status);
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getBlurLoginMessageByNFTGO = async (userAddress) => {
  const postURL =
    "https://api.nftgo.io/api/v1/nft-aggregator/blur/auth/challenge";
  const data = { address: userAddress };
  try {
    // Make the POST request using the fetch API
    const response = await fetch(postURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    // console.log(response);
    if (response.ok) {
      const responseData = await response.json();
      if (responseData.errorCode != 0) {
        return null;
      }
      const data = responseData.data;
      return data;
    } else {
      console.log(response.status);
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getBlurAccessTokenByOpensea = async (requestData) => {
  const postURL = "https://api.pro.opensea.io/blur/auth/login";
  const data = requestData;
  try {
    // Make the POST request using the fetch API
    const response = await fetch(postURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    // console.log(response);
    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.data.toLowerCase() != "Success".toLowerCase()) {
        return null;
      }
      const blurAccessToken = responseData.accessToken;
      return blurAccessToken;
    } else {
      console.log(response.status);
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getBlurAccessTokenByNFTGO = async (requestData) => {
  const postURL = "https://api.nftgo.io/api/v1/nft-aggregator/blur/auth/login";
  const data = requestData;
  try {
    // Make the POST request using the fetch API
    const response = await fetch(postURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    // console.log(response);
    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.errorCode != 0) {
        return null;
      }
      const blurAccessToken = responseData.data.blurAuth;
      return blurAccessToken;
    } else {
      console.log(response.status);
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export {
  getSystemData,
  getClaimYGIOBalance,
  getUserToken,
  getOrderHashSignatureOpenSea,
  getENSOfAddress,
  getAddressOfENS,
  getENSOfAddressTheGraph,
  getAddressOfENSTheGraph,
  getNameByTokenIdTheGraph,
  getENSOfAddressByContract,
  getENSUniversalResolver,
  getENSByTokenId,
  getPriceBaseUSDT,
  getCrossChainSignature,
  getBlurLoginMessageByNFTGO,
  getBlurAccessTokenByNFTGO,
  getBlurLoginMessageByOpensea,
  getBlurAccessTokenByOpensea,
  getPriceBaseUSDTByBinance
};
