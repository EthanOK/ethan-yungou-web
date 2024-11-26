const { logDOM } = require("@testing-library/react");
const { getBalanceETH } = require("./GetProvider");

const getBlurCalldata = async (
  tokenAddress,
  tokenId,
  buyerAddress,
  buyerBlurAccessToken
) => {
  const postURL = "https://api.nftgo.io/api/v1/nft-aggregator/aggregate-v2";
  // 如何获得orderInfo
  const blurOrderInfos = await getNFTGoBlurOrderInfos(tokenAddress, tokenId);
  if (blurOrderInfos.length == 0) return null;
  const orderInfos = [blurOrderInfos[0]];
  // 遍历 orderInfos 计算tokenPrice
  let tokenPrice = 0;
  for (let i = 0; i < orderInfos.length; i++) {
    const orderInfo = orderInfos[i];

    tokenPrice += orderInfo.tokenPrice;
  }
  // 查询 buyerAddress的eth余额
  const balance = await getBalanceETH(buyerAddress);
  console.log(tokenPrice, balance);
  if (Number(tokenPrice) > Number(balance)) {
    alert(`User ETH Insufficient, Need ${tokenPrice} ETH`);
    return 0;
  }

  const data = {
    orderInfos: orderInfos,
    buyer: buyerAddress,
    safeMode: false,
    // accessToken 是登陆 blur 获得的token
    accessToken: buyerBlurAccessToken
  };
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
      const txData = responseData.data.aggregateResult.actions[0].data.txData;
      //   {
      //     from: '0xc675897bb91797eaea7584f025a5533dbb13a000',
      //     to: '0xb2ecfe4e4d61f8790bbb9de2d1259b9e2410cea5',
      //     value: '0x470de4df820000',
      //     data: ''
      //   }
      return txData;
    } else {
      console.log(response);

      console.log("Network Error");
    }
  } catch (error) {
    console.log(error);
  }
};

const getNFTGoBlurOrderInfos = async (contractAddress, tokenId) => {
  const postURL = `https://api.nftgo.io/api/v2/asset/orders?contract=${contractAddress}&tokenId=${tokenId}&limit=20`;
  const orderInfos = [];
  try {
    // Make the POST request using the fetch API
    const response = await fetch(postURL, {
      method: "GET",
      headers: {
        accept: "application/json"
      }
    });

    if (response.ok) {
      const responseData = await response.json();

      const orders = responseData.data.orders;

      if (orders.length > 0) {
        for (let i = 0; i < orders.length; i++) {
          const order = orders[i];
          // console.log(order);
          if (order.orderKind.includes("blur")) {
            const orderInfo = {
              contractAddress: order.address,
              maker: order.maker,
              orderId: order.id,
              tokenId: order.tokenId,
              tokenPrice: order.tokenPrice
            };
            orderInfos.push(orderInfo);
          }
          return orderInfos;
        }
      } else {
        return orderInfos;
      }
    } else {
      console.log("Network Error");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getBlurCalldata };
