import { ethers, BigNumber } from "ethers";
import { getSignerAndChainId, getSigner } from "./GetProvider";
import faucetABI from "../contracts/faucetABI.json";
import erc20ABI from "../contracts/erc20ABI.json";
import erc721ABI from "../contracts/erc721A.json";
import crossChainABI from "../contracts/crossChainABI.json";
import {
  faucet_goerli,
  ygio_goerli,
  faucet_tbsc,
  faucet_sepolia
} from "./SystemConfiguration";
const getContract = async (contractAddress, abi, signer) => {
  let contract = new ethers.Contract(contractAddress, abi, signer);
  return contract;
};

const getFaucetContract = async () => {
  let contractAddress;

  let [signer, chainId] = await getSignerAndChainId();
  if (chainId == 5) {
    contractAddress = faucet_goerli;
  } else if (chainId == 97) {
    contractAddress = faucet_tbsc;
  } else if (chainId == 11155111) {
    contractAddress = faucet_sepolia;
  }

  let contract = new ethers.Contract(contractAddress, faucetABI, signer);
  return contract;
};

const getERC20Contract = async (token) => {
  let signer = await getSigner();
  let contract = new ethers.Contract(token, erc20ABI, signer);
  return contract;
};

const getERC721Contract = async (token) => {
  let signer = await getSigner();
  let contract = new ethers.Contract(token, erc721ABI, signer);
  return contract;
};

const getCrossChainContract = async (token) => {
  let signer = await getSigner();
  let contract = new ethers.Contract(token, crossChainABI, signer);
  return contract;
};
export {
  getContract,
  getFaucetContract,
  getERC20Contract,
  getCrossChainContract,
  getERC721Contract
};
