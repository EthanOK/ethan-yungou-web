const { getBlurCalldata } = require("./GetBlurCallData");
const { getSignerAndChainId } = require("./GetProvider");
const { addSuffixOfTxData } = require("./HandleTxData");
const { suffixOfYunGou } = require("./SystemConfiguration");
const { getScanURL } = require("./Utils");

const onlyBuyBlurNFT = async (
  contract,
  tokenId,
  userAddress,
  blurAccessToken
) => {
  const [signer, chainId] = await getSignerAndChainId();
  if (chainId != 1) {
    alert("Please switch to Mainnet");
    return [null, null];
  }

  const blurData = await getBlurCalldata(
    contract,
    tokenId,
    userAddress,
    blurAccessToken
  );

  if (blurData == null) {
    alert("Blur Order Data is NULL");
    return [null, null];
  } else if (blurData == 0) return [null, null];
  try {
    // 修改前缀
    let inputData = blurData.data;
    if (inputData.endsWith("ff738719")) {
      inputData = inputData.slice(0, -8); // 去掉最后8个字符
    }
    let latestData = addSuffixOfTxData(inputData, suffixOfYunGou);

    const tx = await signer.sendTransaction({
      to: blurData.to,
      data: latestData,
      value: blurData.value
    });

    if (tx != null) {
      console.log("fulfillBasicOrder... please await");
      let etherscanURL = await getScanURL();
      console.log(`Please See: ${etherscanURL}/tx/${tx.hash}`);
      let message_ = `${etherscanURL}/tx/${tx.hash}`;

      return [message_, tx];
    } else {
      return [null, null];
    }
  } catch (error) {
    alert("User refuses transaction");
    return [null, null];
  }
};
module.exports = { onlyBuyBlurNFT };
