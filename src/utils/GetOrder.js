import { BigNumber } from "ethers";

const getFulfillment_transaction = async (
  openseaSDK,
  accountAddress,
  tokenAddress,
  tokenId
) => {
  const order = await openseaSDK.api.getOrder({
    side: "ask",
    assetContractAddress: tokenAddress,
    tokenId: tokenId
  });

  if (order.orderHash == null) {
    return "null";
  }
  console.log("orderHash: " + order.orderHash);
  const fulfillment = await openseaSDK.api.generateFulfillmentData(
    accountAddress,
    order.orderHash,
    order.protocolAddress,
    order.side
  );
  if (
    fulfillment.fulfillment_data.transaction.input_data.parameters.signature ==
    null
  ) {
    return "null";
  }
  console.log("orders");
  console.log(fulfillment.fulfillment_data.orders);
  return fulfillment.fulfillment_data.transaction;
};
const getFulfillment_order = async (
  openseaSDK,
  accountAddress,
  tokenAddress,
  tokenId
) => {
  const order = await openseaSDK.api.getOrder({
    side: "ask",
    assetContractAddress: tokenAddress,
    tokenId: tokenId
  });

  if (order.orderHash == null) {
    return "null";
  }

  const fulfillment = await openseaSDK.api.generateFulfillmentData(
    accountAddress,
    order.orderHash,
    order.protocolAddress,
    order.side
  );
  if (fulfillment.fulfillment_data.orders[0].signature == null) {
    return "null";
  }
  console.log(order);
  return [
    order.protocolAddress,
    order.currentPrice,
    fulfillment.fulfillment_data.orders[0]
  ];
};

// getFulfillAvailableOrders_datas
const getFulfillAvailableOrders_data = async (
  openseaSDK,
  accountAddress,
  tokenAddress_s,
  tokenIds
) => {
  let orders = [];
  let offerFulfillments = [];
  let considerationFulfillments = [];
  let protocolAddress = "0x";
  let fulfillerConduitKey;
  let maximumFulfilled = tokenAddress_s.length;
  let currentPriceSum = BigNumber.from(0);
  let count = 0;
  for (let i = 0; i < tokenAddress_s.length; i++) {
    const order = await openseaSDK.api.getOrder({
      side: "ask",
      assetContractAddress: tokenAddress_s[i],
      tokenId: tokenIds[i]
    });

    if (order.orderHash == null) {
      return "orderHash is null";
    }

    const fulfillment = await openseaSDK.api.generateFulfillmentData(
      accountAddress,
      order.orderHash,
      order.protocolAddress,
      order.side
    );
    if (count == 0) {
      protocolAddress = order.protocolAddress;
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
      considerationFulfillments.push([fulfillmentComponent]);
    }

    const currentPrice = BigNumber.from(order.currentPrice);
    currentPriceSum = currentPriceSum.add(currentPrice);

    orders.push(fulfillment.fulfillment_data.orders[0]);
    // offerFulfillments.push(offerFulfillments_i);
    // considerationFulfillments.push(considerationFulfillments_i);
  }

  return [
    protocolAddress,
    currentPriceSum.toString(),
    orders,
    offerFulfillments,
    considerationFulfillments,
    fulfillerConduitKey,
    maximumFulfilled
  ];
};
// getFulfillAvailableAdvancedOrders_datas
const getFulfillAvailableAdvancedOrders_datas = async (
  openseaSDK,
  accountAddress,
  tokenAddress_s,
  tokenIds
) => {
  let advancedOrders = [];
  let criteriaResolvers = [];
  let offerFulfillments = [];
  let considerationFulfillments = [];
  let protocolAddress = "0x";
  let fulfillerConduitKey;
  let maximumFulfilled = tokenAddress_s.length;
  let currentPriceSum = BigNumber.from(0);
  let count = 0;
  for (let i = 0; i < tokenAddress_s.length; i++) {
    const order = await openseaSDK.api.getOrder({
      side: "ask",
      assetContractAddress: tokenAddress_s[i],
      tokenId: tokenIds[i]
    });

    if (order.orderHash == null) {
      return "orderHash is null";
    }
    console.log("orderHash:" + order.orderHash);
    const fulfillment = await openseaSDK.api.generateFulfillmentData(
      accountAddress,
      order.orderHash,
      order.protocolAddress,
      order.side
    );
    if (count == 0) {
      protocolAddress = order.protocolAddress;
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

    const currentPrice = BigNumber.from(order.currentPrice);
    currentPriceSum = currentPriceSum.add(currentPrice);
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

  return [
    protocolAddress,
    currentPriceSum.toString(),
    advancedOrders,
    criteriaResolvers,
    offerFulfillments,
    considerationFulfillments,
    fulfillerConduitKey,
    maximumFulfilled
  ];
};
export default {
  getFulfillment_transaction,
  getFulfillment_order,
  getFulfillAvailableOrders_data,
  getFulfillAvailableAdvancedOrders_datas
};

const json_generateFulfillmentData_demo = {
  protocol: "seaport1.5",
  fulfillment_data: {
    transaction: {
      function:
        "fulfillBasicOrder_efficient_6GL6yc((address,uint256,uint256,address,address,address,uint256,uint256,uint8,uint256,uint256,bytes32,uint256,bytes32,bytes32,uint256,(uint256,address)[],bytes))",
      chain: 1,
      to: "0x00000000000000adc04c56bf30ac9d3c0aaf14dc",
      value: 140000000000000000,
      input_data: {
        parameters: {
          considerationToken: "0x0000000000000000000000000000000000000000",
          considerationIdentifier: "0",
          considerationAmount: "129500000000000000",
          offerer: "0x02881f93dbe585be933a672f4da8f9973c1d9fb1",
          zone: "0x004c00500000ad104d7dbd00e3ae0a5c00560c00",
          offerToken: "0x0fcbd68251819928c8f6d182fc04be733fa94170",
          offerIdentifier: "6539",
          offerAmount: "1",
          basicOrderType: 0,
          startTime: "1683688595",
          endTime: "1686366995",
          zoneHash:
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          salt: "24446860302761739304752683030156737591518664810215442929816078494468128751857",
          offererConduitKey:
            "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
          fulfillerConduitKey:
            "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
          totalOriginalAdditionalRecipients: "2",
          additionalRecipients: [
            {
              amount: "3500000000000000",
              recipient: "0x0000a26b00c1f0df003000390027140000faa719"
            },
            {
              amount: "7000000000000000",
              recipient: "0x56d4101f5ee2e5f253aa9e3471a5c08c0ffc87d5"
            }
          ],
          signature:
            "0xb211d281217a7e1ecb72049e42f6251ceeff32b43b6013d0bace0f24551abd1ddf856fd24d099f73e24e2d9b65f90b9186fe51bb431d3175d7b151fc0f862151"
        }
      }
    },
    orders: [
      {
        parameters: {
          offerer: "0x02881f93dbe585be933a672f4da8f9973c1d9fb1",
          offer: [
            {
              itemType: 2,
              token: "0x0FCBD68251819928C8f6D182fC04bE733fA94170",
              identifierOrCriteria: "6539",
              startAmount: "1",
              endAmount: "1"
            }
          ],
          consideration: [
            {
              itemType: 0,
              token: "0x0000000000000000000000000000000000000000",
              identifierOrCriteria: "0",
              startAmount: "129500000000000000",
              endAmount: "129500000000000000",
              recipient: "0x02881F93dbe585Be933A672f4dA8f9973c1d9fB1"
            },
            {
              itemType: 0,
              token: "0x0000000000000000000000000000000000000000",
              identifierOrCriteria: "0",
              startAmount: "3500000000000000",
              endAmount: "3500000000000000",
              recipient: "0x0000a26b00c1F0DF003000390027140000fAa719"
            },
            {
              itemType: 0,
              token: "0x0000000000000000000000000000000000000000",
              identifierOrCriteria: "0",
              startAmount: "7000000000000000",
              endAmount: "7000000000000000",
              recipient: "0x56d4101F5Ee2E5F253aA9e3471a5C08C0fFC87D5"
            }
          ],
          startTime: "1683688595",
          endTime: "1686366995",
          orderType: 0,
          zone: "0x004C00500000aD104D7DBd00e3ae0A5C00560C00",
          zoneHash:
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          salt: "0x360c6ebe0000000000000000000000000000000000000000d9d2b46d4d05c0f1",
          conduitKey:
            "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
          totalOriginalConsiderationItems: 3,
          counter: 0
        },
        signature:
          "0xb211d281217a7e1ecb72049e42f6251ceeff32b43b6013d0bace0f24551abd1ddf856fd24d099f73e24e2d9b65f90b9186fe51bb431d3175d7b151fc0f862151"
      }
    ]
  }
};
const json_orderData_demo = {
  createdDate: "2023-05-12T06:21:05.456227",
  closingDate: "2023-05-19T06:21:01",
  listingTime: 1683872461,
  expirationTime: 1684477261,
  orderHash:
    "0x59685e219d837e25f0792b57b711d5612d816c1f4bca721cba200fbe255e4b21",
  maker: {
    address: "0x5aef7f04ff4ab2d3048a8b07cb7e1cdc0fc2e053",
    config: "",
    profileImgUrl:
      "https://storage.googleapis.com/opensea-static/opensea-profile/7.png",
    user: {}
  },
  taker: null,
  protocolData: {
    parameters: {
      offerer: "0x5aef7f04ff4ab2d3048a8b07cb7e1cdc0fc2e053",
      offer: [
        {
          itemType: 2,
          token: "0xc9A51f72e2fe2Fb74CccCd760b929019F680467a",
          identifierOrCriteria: "1959",
          startAmount: "1",
          endAmount: "1"
        }
      ],
      consideration: [
        {
          itemType: 0,
          token: "0x0000000000000000000000000000000000000000",
          identifierOrCriteria: "0",
          startAmount: "68250000000000000",
          endAmount: "68250000000000000",
          recipient: "0x5AeF7F04fF4aB2D3048a8b07CB7e1CDc0Fc2e053"
        },
        {
          itemType: 0,
          token: "0x0000000000000000000000000000000000000000",
          identifierOrCriteria: "0",
          startAmount: "1750000000000000",
          endAmount: "1750000000000000",
          recipient: "0x0000a26b00c1F0DF003000390027140000fAa719"
        }
      ],
      startTime: "1683872461",
      endTime: "1684477261",
      orderType: 0,
      zone: "0x004C00500000aD104D7DBd00e3ae0A5C00560C00",
      zoneHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      salt: "0x360c6ebe000000000000000000000000000000000000000064a1d85578ad734c",
      conduitKey:
        "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
      totalOriginalConsiderationItems: 2,
      counter: 0
    },
    signature: null
  },
  protocolAddress: "0x00000000000000adc04c56bf30ac9d3c0aaf14dc",
  currentPrice: "70000000000000000",
  makerFees: [
    {
      account: {
        address: "0x0000a26b00c1f0df003000390027140000faa719",
        config: "",
        profileImgUrl:
          "https://storage.googleapis.com/opensea-static/opensea-profile/29.png",
        user: null
      },
      basisPoints: "250"
    }
  ],
  takerFees: [],
  side: "ask",
  orderType: "basic",
  cancelled: false,
  finalized: false,
  markedInvalid: false,
  makerAssetBundle: {
    maker: null,
    assets: [
      {
        tokenId: "1959",
        tokenAddress: "0xc9a51f72e2fe2fb74ccccd760b929019f680467a",
        name: "Bobo Council #1959",
        description: "Long live the Bear Market. Long live Bobo Council.",
        owner: null,
        assetContract: {
          name: "Bera Council",
          description: "Long Live the Bear Market. Long Live Bobo Council.",
          type: "non-fungible",
          schemaName: "ERC721",
          address: "0xc9a51f72e2fe2fb74ccccd760b929019f680467a",
          tokenSymbol: "BERA",
          buyerFeeBasisPoints: 0,
          sellerFeeBasisPoints: 750,
          openseaBuyerFeeBasisPoints: 0,
          openseaSellerFeeBasisPoints: 250,
          devBuyerFeeBasisPoints: 0,
          devSellerFeeBasisPoints: 500,
          imageUrl:
            "https://i.seadn.io/gcs/files/ccd8cf058003d71c4e7cbbff1ecd2283.png?w=500&auto=format",
          externalLink: null
        },
        collection: {
          createdDate: null,
          name: "The Bobo Council",
          description: "Long Live the Bear Market. Long Live Bobo Council.",
          slug: "bobocouncil",
          hidden: false,
          featured: false,
          featuredImageUrl:
            "https://i.seadn.io/gcs/files/ccd8cf058003d71c4e7cbbff1ecd2283.png?w=500&auto=format",
          displayData: { card_display_style: "contain", images: null },
          paymentTokens: [],
          openseaBuyerFeeBasisPoints: 0,
          openseaSellerFeeBasisPoints: 250,
          devBuyerFeeBasisPoints: 0,
          devSellerFeeBasisPoints: 500,
          payoutAddress: "0x966403ce6b5dd5c139c3f894456ca73f191940a5",
          imageUrl:
            "https://i.seadn.io/gcs/files/ccd8cf058003d71c4e7cbbff1ecd2283.png?w=500&auto=format",
          largeImageUrl:
            "https://i.seadn.io/gcs/files/ccd8cf058003d71c4e7cbbff1ecd2283.png?w=500&auto=format",
          externalLink: null,
          wikiLink: null,
          fees: { openseaFees: {}, sellerFees: {} }
        },
        orders: null,
        sellOrders: null,
        buyOrders: null,
        imageUrl:
          "https://i.seadn.io/gcs/files/f0b4a6cbfa8e48c8606fd268d61d2f67.png?w=500&auto=format",
        imagePreviewUrl:
          "https://i.seadn.io/gcs/files/f0b4a6cbfa8e48c8606fd268d61d2f67.png?w=500&auto=format",
        imageUrlOriginal:
          "https://backend.mintables.club/revealer/1570/images/1959.png",
        imageUrlThumbnail:
          "https://i.seadn.io/gcs/files/f0b4a6cbfa8e48c8606fd268d61d2f67.png?w=500&auto=format",
        externalLink: null,
        openseaLink:
          "https://opensea.io/assets/ethereum/0xc9a51f72e2fe2fb74ccccd760b929019f680467a/1959",
        numSales: 0,
        lastSale: null,
        backgroundColor: null
      }
    ],
    name: null,
    slug: null,
    description: null,
    externalLink: null,
    permalink: null,
    sellOrders: null
  },
  takerAssetBundle: {
    maker: null,
    assets: [
      {
        tokenId: "0",
        tokenAddress: "0x0000000000000000000000000000000000000000",
        name: "Ether",
        description: "",
        owner: null,
        assetContract: {
          name: "Ether",
          description: null,
          type: "fungible",
          schemaName: "ERC20",
          address: "0x0000000000000000000000000000000000000000",
          tokenSymbol: "ETH",
          buyerFeeBasisPoints: 0,
          sellerFeeBasisPoints: 250,
          openseaBuyerFeeBasisPoints: 0,
          openseaSellerFeeBasisPoints: 250,
          devBuyerFeeBasisPoints: 0,
          devSellerFeeBasisPoints: 0,
          imageUrl: null,
          externalLink: null
        },
        collection: {
          createdDate: null,
          name: "OpenSea PaymentAssets",
          description: null,
          slug: "opensea-paymentassets",
          hidden: true,
          featured: false,
          featuredImageUrl: null,
          displayData: { card_display_style: "contain", images: [] },
          paymentTokens: [],
          openseaBuyerFeeBasisPoints: 0,
          openseaSellerFeeBasisPoints: 250,
          devBuyerFeeBasisPoints: 0,
          devSellerFeeBasisPoints: 0,
          payoutAddress: null,
          imageUrl: null,
          largeImageUrl: null,
          externalLink: null,
          wikiLink: null,
          fees: { openseaFees: {}, sellerFees: {} }
        },
        orders: null,
        sellOrders: null,
        buyOrders: null,
        imageUrl:
          "https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg",
        imagePreviewUrl:
          "https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg",
        imageUrlOriginal:
          "https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg",
        imageUrlThumbnail:
          "https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg",
        externalLink: null,
        openseaLink:
          "https://opensea.io/assets/ethereum/0x0000000000000000000000000000000000000000/0",
        numSales: 4,
        lastSale: null,
        backgroundColor: null
      }
    ],
    name: null,
    slug: null,
    description: null,
    externalLink: null,
    permalink: null,
    sellOrders: null
  }
};
