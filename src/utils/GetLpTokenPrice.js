import { ethers, BigNumber } from "ethers";
import {
  PancakeRouter,
  UniswapRouter,
  bsc_rpc,
  main_rpc
} from "./SystemConfiguration";

import routerABI from "../contracts/UniswapV2RouterABI.json";
import erc20ABI from "../contracts/erc20ABI.json";

const getTokenPrice = async (platform, token0, token1) => {
  try {
    let rpc;
    let routerV2;

    console.log(platform);
    if (platform == "1") {
      // Uniswap
      routerV2 = UniswapRouter;
      rpc = main_rpc;
    } else if (platform == "56") {
      // PancakeSwap
      routerV2 = PancakeRouter;

      rpc = bsc_rpc;
    }

    let provider = new ethers.providers.JsonRpcProvider(rpc);

    let routerContract = new ethers.Contract(routerV2, routerABI, provider);

    let token0Contract = new ethers.Contract(token0, erc20ABI, provider);

    let token1Contract = new ethers.Contract(token1, erc20ABI, provider);

    let decimals0 = await token0Contract.decimals();
    let decimals1 = await token1Contract.decimals();

    let symbol0 = await token0Contract.symbol();
    let symbol1 = await token1Contract.symbol();

    let amounts = await routerContract.getAmountsOut(
      ethers.utils.parseUnits("1", decimals0),
      [token0, token1]
    );
    let token1Price = ethers.utils.formatUnits(amounts[1], decimals1);

    let pairPrice = "1" + " " + symbol0 + " = " + token1Price + " " + symbol1;

    console.log(pairPrice);

    return pairPrice;
  } catch (error) {
    console.log(error);
    return "error";
  }
};
export { getTokenPrice };
