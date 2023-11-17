import { getSignerAndChainId } from "./GetProvider";
import { ethers } from "ethers";
import { signEIP712Message } from "./SignFunc";
import erc721Aabi from "../contracts/erc721A.json";
import { nftMint_goerli } from "./SystemConfiguration";
import { getScanURL, equalityStringIgnoreCase } from "./Utils";

const mintNFT = async (mintAmount) => {
  let etherscanURL = await getScanURL();

  let [signer, chainId] = await getSignerAndChainId();
  let contractAddress;
  if (chainId === 5) {
    contractAddress = nftMint_goerli;
  } else {
    console.log("only goerli");
    alert("only goerli");
    return [null, null];
  }
  try {
    const nftcontract = new ethers.Contract(
      contractAddress,
      erc721Aabi,
      signer
    );
    let result = await nftcontract.callStatic.mint(mintAmount);
    console.log(result);
    let preparetx = await nftcontract.populateTransaction.mint(mintAmount);
    console.log(preparetx.data);
    const tx = await signer.sendTransaction({
      to: contractAddress,
      data: preparetx.data,
      value: "0",
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
    if (chainId === 5) {
      contractAddress = nftMint_goerli;
    } else {
      console.log("only goerli");
      return [null, null];
    }
    let signature = await signEIP712Message(signer, chainId);
    if (signature == null) return [null, null];

    const nftcontract = new ethers.Contract(
      contractAddress,
      erc721Aabi,
      signer
    );

    let tx = await nftcontract.mint(mintAmount);
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
export { mintNFT, signEIP712MessageMintNft };
