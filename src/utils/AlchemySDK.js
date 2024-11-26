import { Alchemy, Network } from "alchemy-sdk";
import { ALCHEMY_KEY_V3 } from "./SystemConfiguration";

const alchemy_mainnet = new Alchemy({
  apiKey: ALCHEMY_KEY_V3,
  network: Network.ETH_MAINNET
});

const alchemy_sepolia = new Alchemy({
  apiKey: ALCHEMY_KEY_V3,
  network: Network.ETH_SEPOLIA
});

const getAlchemy = (chainId) => {
  if (Number(chainId) === 1) {
    return alchemy_mainnet;
  } else if (Number(chainId) === 11155111) {
    return alchemy_sepolia;
  }
  return null;
};
