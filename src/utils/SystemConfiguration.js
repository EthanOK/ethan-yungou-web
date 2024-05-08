import { BigNumber, ethers, providers } from "ethers";

const YunGouAggregatorsAddress_G = "0x5D5177aa0BD5ACeb22A249703DAe840667309F5d";

const chainName_G = "goerli";
const chainName_S = "sepolia";
const chainName_TBSC = "bsctestnet";

const main_url = "https://etherscan.io";
const goerli_url = "https://goerli.etherscan.io";
const sepolia_url = "https://sepolia.etherscan.io";
const tbsc_url = "https://testnet.bscscan.com";
const bsc_url = "https://bscscan.com";

const OPENSEA_MAIN_API = process.env.REACT_APP_OPENSEA_MAIN_API;
const PRIVATEKEY_VERIFYER = process.env.REACT_APP_PRIVATEKEY_VERIFYER;
const YUNGOU = "yungou.io";
// 0xba6d2ab102481cc9032426c704c58df5594a14a433ff7ca084e4bd32c9196783
const hashYUNGOU = ethers.utils.id(YUNGOU);
const YUNGOU_END = hashYUNGOU.slice(0, 10);
const suffixOfYunGou = "0xba6d2ab1";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const main_rpc = process.env.REACT_APP_MAINNET_RPC;
const goerli_rpc = process.env.REACT_APP_GOERLI_RPC;

const bsc_rpc = "https://rpc.ankr.com/bsc";
const projectId_walletconnect = process.env.REACT_APP_WALLETCONNECT_PROJECTID;

const ALCHEMY_KEY_V3 = process.env.REACT_APP_ALCHEMY_KEY_V3;

const YunGou2_0_main = "0x0000006c517ed32ff128b33f137bb4ac31b0c6dd";

const YunGou2_0_goerli = "0xb0E3773e3E02d0A1653F90345Bc8889fC820E230";

const YunGou2_0_sepolia = "0x72fc74cf6d6899b4a0083728664fe2706948dab0";

const YunGou2_0_tbsc = "0x0000006c517ed32ff128b33f137bb4ac31b0c6dd";

const YunGou2_0_bsc = "0x0000006c517ed32ff128b33f137bb4ac31b0c6dd";

const YunGouAggregators_main = "0x0000007eE460B0928c2119E3B9747454A10d1557";

const YunGouAggregators_goerli = "0x5D5177aa0BD5ACeb22A249703DAe840667309F5d";

const YunGouAggregators_tbsc = "0x0000A8086590DD83c8bd58A787412026B86eB772";

const YunGouAggregators_bsc = "0x0000007eE460B0928c2119E3B9747454A10d1557";

const nftMint_goerli = "0x71eE06999F6D5f66AcA3c12e45656362fD9D031f";

const batchTransferToken_sepolia = "0x6e7f9fCcAdFD34689A9542534c25475B5FFB7282";

const faucet_goerli = "0xC1f60B81c6dAb5BE517a53983708488F9978D0Eb";

const faucet_tbsc = "0x1ef1b1405dCda2375Fc8430DE5560016F0D8DBe0";

const faucet_sepolia = "0xaD1dA61611ca6764c8C87806Bb39C66AF212F560";

const yulp_tbsc = "0x21DEf0EeF658237579f40603164Eb86c3453ad97";

const yulp_goerli = "0x333FA70Aaf2a9B4979EB59bcfF2B2f846DBD8DE3";

const ygio_goerli = "0xd042eF5cF97c902bF8F53244F4a81ec4f8E465Ab";

const ygio_tbsc = "0x0Fa4640F99f876D78Fc964AFE0DD6649e7C23c4f";

const ygio_sepolia = "0x5Bb9dE881543594D17a7Df91D62459024c4EEf02";

const ygme_goerli = "0x28D1bC817DE02C9f105A6986eF85cB04863C3042";

const ygme_sepolia = "0x709B78B36b7208f668A3823c1d1992C0805E4f4d";

const crossChain_goerli = "0x2817c37eB23FC4F94f1168A94f26befa1F42FF7d";

const crossChain_tbsc = "0x6AAf3B8a8E42BeDc226e2d1F166Dfdc22d4b5182";

const ygme_tbsc = "0xDb6c494BE6Aae80cc042f9CDA24Ce573aD163A46";

const usdt_goerli = "0x965A558b312E288F5A77F851F7685344e1e73EdF";

const usdt_sepolia = "0x590dcA422b660071F978E5A69851A18529B45415";

const usdt_tbsc = "0xa52770d379e6276e8f798143032442b29D47b567";

const PancakeRouter = "0x10ED43C718714eb63d5aA57B78B54704E256024E";

const UniswapRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

const React_Serve_Back = "http://localhost:3001";

const DefaultChainId = "11155111";

const EXPIRES_TIME = "7d";
const SECRETKEY = "y0Gv3jsn8CnT!^4t$U2c9A@kR6*%PqLpQAWER";
const LOGIN_SOLANA_MESSAGE = "Welcome to ethan-yungou.vercel.app!";

const SOLANA_DEV_RPC = "https://rpc.ankr.com/solana_devnet";

export {
  PancakeRouter,
  UniswapRouter,
  chainName_G,
  chainName_S,
  YUNGOU_END,
  hashYUNGOU,
  OPENSEA_MAIN_API,
  suffixOfYunGou,
  main_rpc,
  goerli_rpc,
  bsc_rpc,
  chainName_TBSC,
  projectId_walletconnect,
  YunGou2_0_main,
  YunGou2_0_goerli,
  YunGou2_0_sepolia,
  YunGou2_0_tbsc,
  YunGou2_0_bsc,
  PRIVATEKEY_VERIFYER,
  nftMint_goerli,
  main_url,
  goerli_url,
  sepolia_url,
  tbsc_url,
  bsc_url,
  React_Serve_Back,
  YunGouAggregatorsAddress_G,
  DefaultChainId,
  YunGouAggregators_main,
  YunGouAggregators_bsc,
  YunGouAggregators_goerli,
  YunGouAggregators_tbsc,
  faucet_goerli,
  faucet_sepolia,
  ygio_goerli,
  ygme_goerli,
  crossChain_goerli,
  crossChain_tbsc,
  faucet_tbsc,
  ygio_tbsc,
  usdt_goerli,
  usdt_sepolia,
  usdt_tbsc,
  yulp_tbsc,
  yulp_goerli,
  EXPIRES_TIME,
  SECRETKEY,
  ygme_tbsc,
  ZERO_ADDRESS,
  LOGIN_SOLANA_MESSAGE,
  SOLANA_DEV_RPC,
  ygme_sepolia,
  ygio_sepolia,
  batchTransferToken_sepolia,
  ALCHEMY_KEY_V3,
};
