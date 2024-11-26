import { getSignerAndChainId } from "./GetProvider";
import { ethers } from "ethers";
import { signEIP712Message } from "./SignFunc";
import YGMEABI from "../contracts/YGMEABI.json";
import BatchTransferTokenABI from "../contracts/BatchTransferTokenABI.json";
import {
  DefaultChainId,
  batchTransferToken_sepolia,
  nftMint_goerli,
  ygme_sepolia
} from "./SystemConfiguration";
import {
  getScanURL,
  equalityStringIgnoreCase,
  getInfuraProvider
} from "./Utils";

const mintNFT = async (mintAmount) => {
  let etherscanURL = await getScanURL();
  let provider = await getInfuraProvider();

  let [signer, chainId] = await getSignerAndChainId();
  let contractAddress;
  if (chainId === Number(DefaultChainId)) {
    contractAddress = batchTransferToken_sepolia;
    console.log(contractAddress);
  } else {
    alert("only sepolia");
    return [null, null];
  }
  try {
    const batchTransfer = new ethers.Contract(
      contractAddress,
      BatchTransferTokenABI,
      signer
    );
    const account = await signer.getAddress();

    const calls = [
      {
        target: ygme_sepolia,
        callData: getSwapCallData(account, mintAmount)
      }
    ];

    let preparetx = await batchTransfer.populateTransaction.aggregate(calls);
    console.log(preparetx.data);

    const transaction = {
      from: await signer.getAddress(),
      to: contractAddress,
      data: preparetx.data
    };
    console.log(transaction);

    // const result = await provider.send("eth_createAccessList", [transaction]);

    // console.log("Access List:", result);

    const tx = await signer.sendTransaction({
      to: contractAddress,
      data: preparetx.data
      // value: "0",
      // accessList: result.accessList,
    });
    console.log("nft mint... please await");

    console.log(`Please See: ${etherscanURL}/tx/${tx.hash}`);
    let message_ = `${etherscanURL}/tx/${tx.hash}`;

    return [message_, tx];
  } catch (error) {
    console.log(error);
    if (equalityStringIgnoreCase(error.code, "ACTION_REJECTED")) {
      alert("User Rejected Transaction");
    }
    if (error.code == -32000) {
      alert(error.message);
    }
    return [null, null];
  }
};
const signEIP712MessageMintNft = async (mintAmount) => {
  try {
    let etherscanURL = await getScanURL();

    let [signer, chainId] = await getSignerAndChainId();
    let contractAddress;
    if (chainId === Number(DefaultChainId)) {
      contractAddress = batchTransferToken_sepolia;
    } else {
      console.log("only sepolia");
      return [null, null];
    }
    let signature = await signEIP712Message(signer, chainId);
    if (signature == null) return [null, null];

    const batchTransfer = new ethers.Contract(
      contractAddress,
      BatchTransferTokenABI,
      signer
    );

    let tx = await batchTransfer.aggregate([
      {
        target: ygme_sepolia,
        callData: getSwapCallData(await signer.getAddress(), mintAmount)
      }
    ]);
    console.log(tx);
    console.log("Minting..please await");
    console.log(`Please See: ${etherscanURL}/tx/${tx.hash}`);
    let message_ = `${etherscanURL}/tx/${tx.hash}`;
    return [message_, tx];
  } catch (error) {
    console.log(error);
    if (equalityStringIgnoreCase(error.code, "ACTION_REJECTED")) {
      alert("User Rejected Transaction");
    }
    if (error.code == -32000) {
      alert(error.message);
    }
    return [null, null];
  }
};

function getSwapCallData(account, amount) {
  const YGMEInterface = new ethers.utils.Interface(YGMEABI);

  let calldata = YGMEInterface.encodeFunctionData("swap", [
    account,
    "0x0000000000000000000000000000000000000000",
    amount
  ]);
  return calldata;
}
export { mintNFT, signEIP712MessageMintNft };
