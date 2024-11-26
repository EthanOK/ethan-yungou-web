import { BigNumber, ethers, providers, utils } from "ethers";
import { OpenSeaSDK, Chain, OpenSeaAPI } from "opensea-js";
import seaportAbi from "../contracts/seaport1_5.json";
import Orders from "./GetOrder";
import OrdersTest from "./GetOrdersTestnet";
import { addSuffixOfTxData, getNewTx } from "./HandleTxData";

import {
  chainName_G,
  YUNGOU_END,
  suffixOfYunGou,
  chainName_TBSC,
  OPENSEA_MAIN_API,
  chainName_S
} from "./SystemConfiguration";
import {
  getSigner,
  getProvider,
  getProviderWeb3,
  getChainId,
  getBalance
} from "./GetProvider";
import { getScanURL } from "./Utils";

// TODO:fulfillBasicOrder
const fulfillBasicOrder = async (contract_, tokenId_, currentAccount) => {
  const providerWeb3 = await getProvider();
  const signer = providerWeb3.getSigner();
  const chainId = localStorage.getItem("chainId");

  let transactionData;
  if (contract_ == "" || tokenId_ == "") {
    console.log("contractAddress or tokenId is null");
    return;
  }

  if (chainId == 1) {
    const openseaSDK = new OpenSeaSDK(providerWeb3, {
      chain: Chain.Mainnet,
      apiKey: OPENSEA_MAIN_API
    });

    transactionData = await Orders.getFulfillment_transaction(
      openseaSDK,
      currentAccount,
      contract_,
      tokenId_
    );
  } else if (chainId == 56) {
    const openseaSDK = new OpenSeaSDK(providerWeb3, {
      chain: Chain.BNB,
      apiKey: OPENSEA_MAIN_API
    });

    transactionData = await Orders.getFulfillment_transaction(
      openseaSDK,
      currentAccount,
      contract_,
      tokenId_
    );
  } else if (chainId == 11155111) {
    transactionData = await OrdersTest.getFulfillment_transaction(
      chainName_S,
      currentAccount,
      contract_,
      tokenId_
    );
    if (transactionData == null) {
      console.log("transactionDatas is null");
      return;
    }
  } else if (chainId == 97) {
    transactionData = await OrdersTest.getFulfillment_transaction(
      chainName_TBSC,
      currentAccount,
      contract_,
      tokenId_
    );
    if (transactionData == null) {
      console.log("transactionDatas is null");
      return;
    }
  }
  console.log(transactionData);
  const parameters = transactionData.input_data.parameters;
  const nftcontract = new ethers.Contract(
    transactionData.to,
    seaportAbi,
    signer
  );
  const value = transactionData.value;
  console.log(parameters);
  let result =
    await nftcontract.populateTransaction.fulfillBasicOrder(parameters);
  const inputData = result.data;

  let resultData = await nftcontract.callStatic.fulfillBasicOrder(parameters, {
    value: ethers.BigNumber.from(value.toString())
  });
  console.log(resultData);

  // const inputDataWithExtra = await addSuffixOfTxData(inputData, suffixOfYunGou);
  // const tx = await signer.sendTransaction({
  //   to: nftcontract.address,
  //   data: inputDataWithExtra,
  //   value: ethers.BigNumber.from(value.toString()),
  // });
  const tx = await getNewTx(
    signer,
    nftcontract.address,
    inputData,
    suffixOfYunGou,
    ethers.BigNumber.from(value.toString())
  );

  if (tx != null) {
    console.log("fulfillBasicOrder... please await");
    let etherscanURL = await getScanURL();
    console.log(`Please See: ${etherscanURL}/tx/${tx.hash}`);
    let message_ = `${etherscanURL}/tx/${tx.hash}`;

    return [message_, tx];
  } else {
    return [null, null];
  }
};

// TODO:fulfillOrder
const fulfillOrder = async (contract_, tokenId_, currentAccount) => {
  const providerWeb3 = await getProvider();
  const signer = providerWeb3.getSigner();
  const chainId = localStorage.getItem("chainId");
  let orderdata = [];
  if (chainId == 1) {
    const openseaSDK = new OpenSeaSDK(providerWeb3, {
      chain: Chain.Mainnet,
      apiKey: OPENSEA_MAIN_API
    });
    // [protocolAddress, value_wei, order]
    orderdata = await Orders.getFulfillment_order(
      openseaSDK,
      currentAccount,
      contract_,
      tokenId_
    );
  } else if (chainId == 56) {
    const openseaSDK = new OpenSeaSDK(providerWeb3, {
      chain: Chain.BNB,
      apiKey: OPENSEA_MAIN_API
    });
    // [protocolAddress, value_wei, order]
    orderdata = await Orders.getFulfillment_order(
      openseaSDK,
      currentAccount,
      contract_,
      tokenId_
    );
  } else if (chainId == 11155111) {
    orderdata = await OrdersTest.getFulfillment_order(
      chainName_S,
      currentAccount,
      contract_,
      tokenId_
    );
  } else if (chainId == 97) {
    orderdata = await OrdersTest.getFulfillment_order(
      chainName_TBSC,
      currentAccount,
      contract_,
      tokenId_
    );
  }
  const [protocolAddress, value_wei, order] = orderdata;

  const nftcontract = new ethers.Contract(protocolAddress, seaportAbi, signer);
  console.log("parameters:");
  console.log(order);
  // function fulfillOrder(Order calldata,bytes32 fulfillerConduitKey)
  const fulfillerConduitKey =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  let callStaticReturn = await nftcontract.callStatic.fulfillOrder(
    order,
    fulfillerConduitKey,
    {
      value: ethers.BigNumber.from(value_wei.toString())
    }
  );
  console.log("call fulfillOrder result: " + callStaticReturn);

  let tx = await nftcontract.fulfillOrder(order, fulfillerConduitKey, {
    value: ethers.BigNumber.from(value_wei.toString())
  });

  console.log("fulfillOrder... please await");
  let etherscanURL = await getScanURL();
  console.log(`Please See: ${etherscanURL}/tx/${tx.hash}`);
  let message_ = `${etherscanURL}/tx/${tx.hash}`;
  return [message_, tx];
};
// // TODO:fulfillBasicOrder_efficient
const fulfillBasicOrder_efficient = async (
  contract_,
  tokenId_,
  currentAccount
) => {
  const providerWeb3 = await getProvider();
  const signer = providerWeb3.getSigner();
  const chainId = localStorage.getItem("chainId");
  // chainId == 1
  let transactionData;
  if (chainId == 1) {
    const openseaSDK = new OpenSeaSDK(providerWeb3, {
      chain: Chain.Mainnet,
      apiKey: OPENSEA_MAIN_API
    });
    transactionData = await Orders.getFulfillment_transaction(
      openseaSDK,
      currentAccount,
      contract_,
      tokenId_
    );
  } else if (chainId == 56) {
    const openseaSDK = new OpenSeaSDK(providerWeb3, {
      chain: Chain.BNB,
      apiKey: OPENSEA_MAIN_API
    });
    transactionData = await Orders.getFulfillment_transaction(
      openseaSDK,
      currentAccount,
      contract_,
      tokenId_
    );
  } else if (chainId == 11155111) {
    transactionData = await OrdersTest.getFulfillment_transaction(
      chainName_S,
      currentAccount,
      contract_,
      tokenId_
    );
    if (transactionData == null) {
      console.log("transactionDatas is null");
      return;
    }
  } else if (chainId == 97) {
    transactionData = await OrdersTest.getFulfillment_transaction(
      chainName_TBSC,
      currentAccount,
      contract_,
      tokenId_
    );
    if (transactionData == null) {
      console.log("transactionDatas is null");
      return;
    }
  }
  const parameters = transactionData.input_data.parameters;
  const nftcontract = new ethers.Contract(
    transactionData.to,
    seaportAbi,
    signer
  );
  const value = transactionData.value;
  let resultData =
    await nftcontract.callStatic.fulfillBasicOrder_efficient_6GL6yc(
      parameters,
      {
        value: ethers.BigNumber.from(value.toString())
      }
    );
  console.log(resultData);
  let tx = await nftcontract.fulfillBasicOrder_efficient_6GL6yc(parameters, {
    value: ethers.BigNumber.from(value.toString())
  });

  console.log("fulfillBasicOrder_efficient... please await");
  let etherscanURL = await getScanURL();
  console.log(`Please See: ${etherscanURL}/tx/${tx.hash}`);
  let message_ = `${etherscanURL}/tx/${tx.hash}`;
  return [message_, tx];
};

// TODO:fulfillAvailableOrders
const fulfillAvailableOrders = async (
  contracts_,
  tokenIds_,
  currentAccount
) => {
  let data = { contracts: contracts_, tokenIds: tokenIds_ };
  console.log(data);

  const providerWeb3 = await getProvider();
  const signer = providerWeb3.getSigner();
  const chainId = localStorage.getItem("chainId");
  // chainId == 1
  let protocolAddress,
    currentPriceSum,
    orders,
    offerFulfillments,
    considerationFulfillments,
    fulfillerConduitKey,
    maximumFulfilled;

  if (chainId == 1) {
    const openseaSDK = new OpenSeaSDK(providerWeb3, {
      chain: Chain.Mainnet,
      apiKey: OPENSEA_MAIN_API
    });
    [
      protocolAddress,
      currentPriceSum,
      orders,
      offerFulfillments,
      considerationFulfillments,
      fulfillerConduitKey,
      maximumFulfilled
    ] = await Orders.getFulfillAvailableOrders_data(
      openseaSDK,
      currentAccount,
      contracts_,
      tokenIds_
    );
  } else if (chainId == 56) {
    const openseaSDK = new OpenSeaSDK(providerWeb3, {
      chain: Chain.BNB,
      apiKey: OPENSEA_MAIN_API
    });
    [
      protocolAddress,
      currentPriceSum,
      orders,
      offerFulfillments,
      considerationFulfillments,
      fulfillerConduitKey,
      maximumFulfilled
    ] = await Orders.getFulfillAvailableOrders_data(
      openseaSDK,
      currentAccount,
      contracts_,
      tokenIds_
    );
  } else if (chainId == 11155111) {
    [
      protocolAddress,
      currentPriceSum,
      orders,
      offerFulfillments,
      considerationFulfillments,
      fulfillerConduitKey,
      maximumFulfilled
    ] = await OrdersTest.getFulfillAvailableOrders_data(
      chainName_S,
      currentAccount,
      contracts_,
      tokenIds_
    );
    console.log(orders);
  } else if (chainId == 97) {
    [
      protocolAddress,
      currentPriceSum,
      orders,
      offerFulfillments,
      considerationFulfillments,
      fulfillerConduitKey,
      maximumFulfilled
    ] = await OrdersTest.getFulfillAvailableOrders_data(
      chainName_TBSC,
      currentAccount,
      contracts_,
      tokenIds_
    );
    console.log(orders);
  }

  const nftcontract = new ethers.Contract(protocolAddress, seaportAbi, signer);

  //  function fulfillAvailableOrders(
  //  Order[] calldata,
  // FulfillmentComponent[][] calldata,
  // FulfillmentComponent[][] calldata,
  // bytes32 fulfillerConduitKey,
  // uint256 maximumFulfilled )

  let callstaticResult = await nftcontract.callStatic.fulfillAvailableOrders(
    orders,
    offerFulfillments,
    considerationFulfillments,
    fulfillerConduitKey,
    maximumFulfilled,
    {
      value: ethers.BigNumber.from(currentPriceSum.toString())
    }
  );
  console.log("callstaticResult: " + callstaticResult);
  let tx = await nftcontract.fulfillAvailableOrders(
    orders,
    offerFulfillments,
    considerationFulfillments,
    fulfillerConduitKey,
    maximumFulfilled,
    {
      value: ethers.BigNumber.from(currentPriceSum.toString())
    }
  );
  console.log("fulfillAvailableOrders... please await");
  let etherscanURL = await getScanURL();
  console.log(`Please See: ${etherscanURL}/tx/${tx.hash}`);
  let message_ = `${etherscanURL}/tx/${tx.hash}`;
  return [message_, tx];
};

// TODO:fulfillAvailableAdvancedOrders
const fulfillAvailableAdvancedOrders = async (
  contracts_,
  tokenIds_,
  currentAccount
) => {
  let data = { contracts: contracts_, tokenIds: tokenIds_ };
  console.log(data);
  const provider = await getProvider();
  const signer = provider.getSigner();
  const chainId = localStorage.getItem("chainId");
  // chainId == 1
  let protocolAddress,
    currentPriceSum,
    advancedOrders,
    criteriaResolvers,
    offerFulfillments,
    considerationFulfillments,
    fulfillerConduitKey,
    maximumFulfilled;

  if (contracts_ == "" || tokenIds_ == "") {
    console.log("contractAddress or tokenIds is null");
    return;
  }
  if (chainId == 1) {
    const openseaSDK = new OpenSeaSDK(provider, {
      chain: Chain.Mainnet,
      apiKey: OPENSEA_MAIN_API
    });
    [
      protocolAddress,
      currentPriceSum,
      advancedOrders,
      criteriaResolvers,
      offerFulfillments,
      considerationFulfillments,
      fulfillerConduitKey,
      maximumFulfilled
    ] = await Orders.getFulfillAvailableAdvancedOrders_datas(
      openseaSDK,
      currentAccount,
      contracts_,
      tokenIds_
    );
  } else if (chainId == 56) {
    const openseaSDK = new OpenSeaSDK(provider, {
      chain: Chain.BNB,
      apiKey: OPENSEA_MAIN_API
    });
    [
      protocolAddress,
      currentPriceSum,
      advancedOrders,
      criteriaResolvers,
      offerFulfillments,
      considerationFulfillments,
      fulfillerConduitKey,
      maximumFulfilled
    ] = await Orders.getFulfillAvailableAdvancedOrders_datas(
      openseaSDK,
      currentAccount,
      contracts_,
      tokenIds_
    );
  } else if (chainId == 11155111) {
    const Orders_datas =
      await OrdersTest.getFulfillAvailableAdvancedOrders_datas(
        chainName_S,
        currentAccount,
        contracts_,
        tokenIds_
      );
    if (Orders_datas == null) {
      console.log("Orders_datas is null");
      return null;
    }
    [
      protocolAddress,
      currentPriceSum,
      advancedOrders,
      criteriaResolvers,
      offerFulfillments,
      considerationFulfillments,
      fulfillerConduitKey,
      maximumFulfilled
    ] = Orders_datas;
  } else if (chainId == 97) {
    const Orders_datas =
      await OrdersTest.getFulfillAvailableAdvancedOrders_datas(
        chainName_TBSC,
        currentAccount,
        contracts_,
        tokenIds_
      );
    if (Orders_datas == null) {
      console.log("Orders_datas is null");
      return null;
    }
    [
      protocolAddress,
      currentPriceSum,
      advancedOrders,
      criteriaResolvers,
      offerFulfillments,
      considerationFulfillments,
      fulfillerConduitKey,
      maximumFulfilled
    ] = Orders_datas;
  }

  console.log("advancedOrders: ");
  console.log(advancedOrders);
  console.log("criteriaResolvers: ");
  console.log(criteriaResolvers);
  console.log("offerFulfillments: ");
  console.log(offerFulfillments);
  console.log("considerationFulfillments: ");
  console.log(considerationFulfillments);
  const nftcontract = new ethers.Contract(protocolAddress, seaportAbi, signer);

  // function fulfillAvailableAdvancedOrders(
  //   AdvancedOrder[] calldata,
  //   CriteriaResolver[] calldata,
  //   FulfillmentComponent[][] calldata,
  //   FulfillmentComponent[][] calldata,
  //   bytes32 fulfillerConduitKey,
  //   address recipient,
  //   uint256 maximumFulfilled)
  const fulfillerConduitKey_0 =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  const currentAccount_1 = "0x0000000000000000000000000000000000000001";
  let result =
    await nftcontract.populateTransaction.fulfillAvailableAdvancedOrders(
      advancedOrders,
      criteriaResolvers,
      offerFulfillments,
      considerationFulfillments,
      fulfillerConduitKey_0,
      currentAccount,
      maximumFulfilled
    );
  const inputData = result.data;

  const inputDataWithExtra = await addSuffixOfTxData(inputData, suffixOfYunGou);

  let callstaticResult =
    await nftcontract.callStatic.fulfillAvailableAdvancedOrders(
      advancedOrders,
      criteriaResolvers,
      offerFulfillments,
      considerationFulfillments,
      fulfillerConduitKey_0,
      currentAccount,
      maximumFulfilled,
      {
        value: ethers.BigNumber.from(currentPriceSum.toString())
      }
    );
  console.log("callstaticResult: " + callstaticResult);

  const tx = await signer.sendTransaction({
    to: nftcontract.address,
    data: inputDataWithExtra,
    value: ethers.BigNumber.from(currentPriceSum.toString())
  });

  console.log("fulfillAvailableAdvancedOrders... please await");
  let etherscanURL = await getScanURL();
  console.log(`Please See: ${etherscanURL}/tx/${tx.hash}`);
  let message_ = `${etherscanURL}/tx/${tx.hash}`;
  return [message_, tx];
};

export {
  fulfillBasicOrder,
  fulfillOrder,
  fulfillBasicOrder_efficient,
  fulfillAvailableAdvancedOrders,
  fulfillAvailableOrders
};
