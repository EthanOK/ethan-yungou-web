import { BigNumber } from "ethers";

// testnet 同一集合下的多个nft
const getFulfillment_transactions = async (
  chainName,
  fulfiller,
  tokenAddress,
  tokenIds
) => {
  const [orderhashs, protocolAddress] = await getOrderHashs(
    chainName,
    tokenAddress,
    tokenIds
  );
  if (orderhashs.length === 0) {
    return null;
  }

  await waitOneSecond();
  const transactions = [];
  for (let i = 0; i < orderhashs.length; i++) {
    await waitOneSecond();
    const transaction = await getFulfillmentData_transaction(
      orderhashs[i],
      chainName,
      protocolAddress[i],
      fulfiller
    );

    transactions.push(transaction);
    console.log("orderhash:" + orderhashs[i]);
  }
  return transactions;
};
// testnet transaction
const getFulfillment_transaction = async (
  chainName,
  fulfiller,
  tokenAddress,
  tokenId
) => {
  const [orderhash, protocolAddress] = await getOrderHash(
    chainName,
    tokenAddress,
    tokenId
  );
  if (orderhash == null) {
    return null;
  }
  await waitOneSecond();
  const transaction = await getFulfillmentData_transaction(
    orderhash,
    chainName,
    protocolAddress,
    fulfiller
  );

  return transaction;
};
// getFulfillAvailableAdvancedOrders_datas
const getFulfillAvailableAdvancedOrders_datas = async (
  chainName,
  fulfiller,
  tokenAddress_s,
  tokenIds
) => {
  let advancedOrders = [];
  let criteriaResolvers = [];
  let offerFulfillments = [];
  let considerationFulfillments = [];
  let protocolAddress_ = "0x";
  let fulfillerConduitKey;
  let maximumFulfilled = tokenAddress_s.length;
  let currentPriceSum = BigNumber.from(0);
  let count = 0;
  for (let i = 0; i < tokenAddress_s.length; i++) {
    const OrderData = await getOrderHash(
      chainName,
      tokenAddress_s[i],
      tokenIds[i]
    );
    if (OrderData == null) {
      return null;
    }
    console.log("OrderData:");
    console.log(OrderData);
    const [orderHash, protocolAddress, currentPrice] = OrderData;

    await waitOneSecond();
    console.log("getFulfillmentData params:");
    console.log(orderHash, chainName, protocolAddress, fulfiller);
    const fulfillment = await getFulfillmentData(
      orderHash,
      chainName,
      protocolAddress,
      fulfiller
    );
    await waitOneSecond();
    if (count === 0) {
      protocolAddress_ = protocolAddress;
      fulfillerConduitKey =
        fulfillment.fulfillment_data.transaction.input_data.parameters
          .fulfillerConduitKey;
    }
    count++;
    // console.log(fulfillment.fulfillment_data.transaction.input_data.parameters);
    if (fulfillment.fulfillment_data.orders[0].signature == null) {
      return "signature is null";
    }
    let length_offer =
      fulfillment.fulfillment_data.orders[0].parameters.offer.length;

    let offerFulfillments_i = [];
    for (let j = 0; j < length_offer; j++) {
      const fulfillmentComponent = {
        orderIndex: i,
        itemIndex: j
      };
      offerFulfillments.push([fulfillmentComponent]);
    }
    let length_consideration =
      fulfillment.fulfillment_data.orders[0].parameters.consideration.length;

    let considerationFulfillments_i = [];
    for (let j = 0; j < length_consideration; j++) {
      const fulfillmentComponent = {
        orderIndex: i,
        itemIndex: j
      };
      //   considerationFulfillments.push([fulfillmentComponent]);
      considerationFulfillments.push([fulfillmentComponent]);
    }

    currentPriceSum = currentPriceSum.add(BigNumber.from(currentPrice));
    // OrderParameters parameters;
    // uint120 numerator;
    // uint120 denominator;
    // bytes signature;
    // bytes extraData;
    const advancedOrder = {
      parameters: fulfillment.fulfillment_data.orders[0].parameters,
      numerator: 1,
      denominator: 1,
      signature: fulfillment.fulfillment_data.orders[0].signature,
      extraData: "0x"
    };
    advancedOrders.push(advancedOrder);
    // offerFulfillments.push(offerFulfillments_i);
    // considerationFulfillments.push(considerationFulfillments_i);
  }
  console.log("opensea orders total payment:" + currentPriceSum.toString());
  return [
    protocolAddress_,
    currentPriceSum.toString(),
    advancedOrders,
    criteriaResolvers,
    offerFulfillments,
    considerationFulfillments,
    fulfillerConduitKey,
    maximumFulfilled
  ];
};
// getFulfillAvailableOrders_datas
const getFulfillAvailableOrders_data = async (
  chainName,
  fulfiller,
  tokenAddress_s,
  tokenIds
) => {
  let orders = [];

  let offerFulfillments = [];
  let considerationFulfillments = [];
  let protocolAddress_ = "0x";
  let fulfillerConduitKey;
  let maximumFulfilled = tokenAddress_s.length;
  let currentPriceSum = BigNumber.from(0);
  let count = 0;
  for (let i = 0; i < tokenAddress_s.length; i++) {
    const OrderData = await getOrderHash(
      chainName,
      tokenAddress_s[i],
      tokenIds[i]
    );
    if (OrderData == null) {
      return null;
    }
    console.log("OrderData:");
    console.log(OrderData);
    const [orderHash, protocolAddress, currentPrice] = OrderData;

    await waitOneSecond();
    console.log("getFulfillmentData params:");
    console.log(orderHash, chainName, protocolAddress, fulfiller);
    const fulfillment = await getFulfillmentData(
      orderHash,
      chainName,
      protocolAddress,
      fulfiller
    );
    await waitOneSecond();
    if (count === 0) {
      protocolAddress_ = protocolAddress;
      fulfillerConduitKey =
        fulfillment.fulfillment_data.transaction.input_data.parameters
          .fulfillerConduitKey;
    }
    count++;
    // console.log(fulfillment.fulfillment_data.transaction.input_data.parameters);
    if (fulfillment.fulfillment_data.orders[0].signature == null) {
      return "signature is null";
    }
    let length_offer =
      fulfillment.fulfillment_data.orders[0].parameters.offer.length;

    let offerFulfillments_i = [];
    for (let j = 0; j < length_offer; j++) {
      const fulfillmentComponent = {
        orderIndex: i,
        itemIndex: j
      };
      offerFulfillments.push([fulfillmentComponent]);
    }
    let length_consideration =
      fulfillment.fulfillment_data.orders[0].parameters.consideration.length;

    let considerationFulfillments_i = [];
    for (let j = 0; j < length_consideration; j++) {
      const fulfillmentComponent = {
        orderIndex: i,
        itemIndex: j
      };
      //   considerationFulfillments.push([fulfillmentComponent]);
      considerationFulfillments.push([fulfillmentComponent]);
    }

    currentPriceSum = currentPriceSum.add(BigNumber.from(currentPrice));
    // OrderParameters parameters;
    // bytes signature;

    let order = {
      parameters: fulfillment.fulfillment_data.orders[0].parameters,
      signature: fulfillment.fulfillment_data.orders[0].signature
    };

    orders.push(order);
    // offerFulfillments.push(offerFulfillments_i);
    // considerationFulfillments.push(considerationFulfillments_i);
  }
  console.log("opensea orders total payment:" + currentPriceSum.toString());

  return [
    protocolAddress_,
    currentPriceSum.toString(),
    orders,
    offerFulfillments,
    considerationFulfillments,
    fulfillerConduitKey,
    maximumFulfilled
  ];
};
// getFulfillment_order
const getFulfillment_order = async (
  chainName,
  fulfiller,
  tokenAddress,
  tokenId
) => {
  const OrderData = await getOrderHash(chainName, tokenAddress, tokenId);
  if (OrderData == null) {
    return null;
  }
  console.log("OrderData:");
  console.log(OrderData);
  const [orderHash, protocolAddress, currentPrice] = OrderData;

  await waitOneSecond();
  console.log(
    "getFulfillmentData params:orderHash, chainName, protocolAddress, fulfiller"
  );
  console.log(orderHash, chainName, protocolAddress, fulfiller);
  const fulfillment = await getFulfillmentData(
    orderHash,
    chainName,
    protocolAddress,
    fulfiller
  );
  console.log(fulfillment);
  return [
    protocolAddress,
    currentPrice,
    fulfillment.fulfillment_data.orders[0]
  ];
};
export default {
  getFulfillment_transactions,
  getFulfillment_transaction,
  getFulfillAvailableAdvancedOrders_datas,
  getFulfillment_order,
  getFulfillAvailableOrders_data
};

async function waitOneSecond() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}
async function getOrderHashs(chainName, contract_address, token_ids) {
  const options = { method: "GET", headers: { accept: "application/json" } };
  let str_token_ids = "";
  for (let i = 0; i < token_ids.length; i++) {
    if (i === 0) {
      str_token_ids = `${token_ids[i]}`;
    } else {
      str_token_ids = str_token_ids + `&token_ids=${token_ids[i]}`;
    }
  }

  const listings_url = `https://testnets-api.opensea.io/v2/orders/${chainName}/seaport/listings?asset_contract_address=${contract_address}&token_ids=${str_token_ids}`;
  const orders = await fetch(listings_url, options)
    .then((response) => response.json())
    .then((response) => {
      return response.orders;
    })
    .catch((err) => console.error(err));

  const orderhashs = [];
  const protocolAddress = [];
  for (let i = 0; i < orders.length; i++) {
    orderhashs.push(orders[i].order_hash);
    protocolAddress.push(orders[i].protocol_address);
  }
  return [orderhashs, protocolAddress];
}
async function getOrderHash(chainName, contract_address, token_id) {
  const options = { method: "GET", headers: { accept: "application/json" } };

  const listings_url = `https://testnets-api.opensea.io/v2/orders/${chainName}/seaport/listings?asset_contract_address=${contract_address}&token_ids=${token_id}`;
  const orders = await fetch(listings_url, options)
    .then((response) => response.json())
    .then((response) => {
      return response.orders;
    })
    .catch((err) => console.error(err));

  if (orders.length === 0) {
    return null;
  }
  console.log("orders:");
  console.log(orders);
  return [
    orders[0].order_hash,
    orders[0].protocol_address,
    orders[0].current_price
  ];
}
async function getOrder(contract_address, token_id) {
  const options = { method: "GET", headers: { accept: "application/json" } };

  const listings_url = `https://testnets-api.opensea.io/v2/orders/goerli/seaport/listings?asset_contract_address=${contract_address}&token_ids=${token_id}`;
  const orders = await fetch(listings_url, options)
    .then((response) => response.json())
    .then((response) => {
      return response.orders;
    })
    .catch((err) => console.error(err));

  if (orders.length === 0) {
    return null;
  }
  console.log("orders:");
  console.log(orders);
  return orders[0];
}
async function getFulfillmentData(hash, chain, protocol_address, fulfiller) {
  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      listing: {
        hash: hash,
        chain: chain,
        protocol_address: protocol_address
      },
      fulfiller: { address: fulfiller }
    })
  };

  const response_data = await fetch(
    "https://testnets-api.opensea.io/v2/listings/fulfillment_data",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => console.error(err));

  return response_data;
}
async function getFulfillmentData_transaction(
  hash,
  chain,
  protocol_address,
  fulfiller
) {
  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      listing: {
        hash: hash,
        chain: chain,
        protocol_address: protocol_address
      },
      fulfiller: { address: fulfiller }
    })
  };

  const response_data = await fetch(
    "https://testnets-api.opensea.io/v2/listings/fulfillment_data",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => console.error(err));
  console.log(response_data);
  return response_data.fulfillment_data.transaction;
}
