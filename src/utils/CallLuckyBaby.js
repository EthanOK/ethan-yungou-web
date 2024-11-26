import { getSignerAndAccountAndChainId } from "./GetProvider";
import { ethers, BigNumber } from "ethers";

import usdtabi from "../contracts/usdtABI.json";
import luckyBabyabi from "../contracts/luckyBabyABI.json";

import { getScanURL, equalityStringIgnoreCase } from "./Utils";

const luckyBabyAddress = "0x66fD5106a5Af336CE81fd38A5AB2FFFD9bCD1C8c";

const participate = async (count) => {
  if (count == 0) {
    alert("count must be greater than 0");
    return [null, null];
  }
  let etherscanURL = await getScanURL();

  let [signer, account, chainId] = await getSignerAndAccountAndChainId();

  let luckyBaby;
  let payToken;
  let currentIssueId;
  let payAmount = BigNumber.from("0");
  if (chainId === 5) {
    luckyBaby = new ethers.Contract(luckyBabyAddress, luckyBabyabi, signer);
    currentIssueId = await luckyBaby.currentIssueId();

    let issueData = await luckyBaby.issueDatas(currentIssueId);

    if (issueData.openState) {
      alert("The Issue Already Opened");
      return [null, null];
    }
    let countRemain = await luckyBaby.getCountRemainOfAccount(
      account,
      currentIssueId
    );
    console.log("countRemain:" + countRemain.toString());
    if (count > countRemain) {
      alert("Remain count: " + countRemain.toString());
      return [null, null];
    }
    payAmount = issueData.payToken.amount * count;

    payToken = new ethers.Contract(issueData.payToken.token, usdtabi, signer);
  } else {
    console.log("only goerli");
    alert("only goerli");
    return [null, null];
  }
  try {
    let balance = await payToken.balanceOf(account);
    if (payAmount > balance) {
      alert("Insufficient balance");
      return [null, null];
    }
    let allowance = await payToken.allowance(account, luckyBabyAddress);
    if (allowance < payAmount) {
      console.log(payAmount);
      const tx = await payToken.approve(luckyBabyAddress, payAmount.toString());
      let result = await tx.wait();

      if (result.status != 1) {
        alert("Approve failed");
        return [null, null];
      }
    }
    const tx = await luckyBaby.participate(currentIssueId, count);
    console.log(" participate ... please await");

    console.log(`Please See: ${etherscanURL}/tx/${tx.hash}`);
    let message_ = `${etherscanURL}/tx/${tx.hash}`;

    return [message_, tx];
  } catch (error) {
    let message_;
    if (equalityStringIgnoreCase(error.code, "ACTION_REJECTED")) {
      message_ = "User Reject Transaction";
    } else if (error.code == -32000) {
      message_ = error.message;
    } else if (error.error.code == -32603) {
      message_ = error.error.message;
    }
    alert(message_);
    return [message_, null];
  }
};

const openPrizePool = async () => {
  let etherscanURL = await getScanURL();
  try {
    let [signer, account, chainId] = await getSignerAndAccountAndChainId();

    let luckyBaby;

    let currentIssueId;

    if (chainId === 5) {
      luckyBaby = new ethers.Contract(luckyBabyAddress, luckyBabyabi, signer);
      currentIssueId = await luckyBaby.currentIssueId();

      let tx = await luckyBaby.openPrizePool(currentIssueId, []);

      console.log("openPrizePool ... please await");

      console.log(`Please See: ${etherscanURL}/tx/${tx.hash}`);
      let message_ = `${etherscanURL}/tx/${tx.hash}`;

      return [message_, tx];
    }
  } catch (error) {
    let message_;
    if (equalityStringIgnoreCase(error.code, "ACTION_REJECTED")) {
      message_ = "User Reject Transaction";
    } else if (error.code == -32000) {
      message_ = error.message;
    } else if (error.error.code == -32603) {
      message_ = error.error.message;
    }

    return [message_, null];
  }
};

const incrementNewIssue = async (
  numberMax,
  countMaxPer,
  startTime,
  endTime,
  payToken,
  prize
) => {
  let etherscanURL = await getScanURL();
  try {
    let [signer, account, chainId] = await getSignerAndAccountAndChainId();

    let luckyBaby;

    if (chainId === 5) {
      luckyBaby = new ethers.Contract(luckyBabyAddress, luckyBabyabi, signer);

      let tx = await luckyBaby.incrementNewIssue(
        numberMax,
        countMaxPer,
        startTime,
        endTime,
        payToken,
        prize
      );

      console.log("increment NewIssue ... please await");

      console.log(`Please See: ${etherscanURL}/tx/${tx.hash}`);
      let message_ = `${etherscanURL}/tx/${tx.hash}`;

      return [message_, tx];
    }
  } catch (error) {
    let message_;
    if (equalityStringIgnoreCase(error.code, "ACTION_REJECTED")) {
      message_ = "User Reject Transaction";
    } else if (error.code == -32000) {
      message_ = error.message;
    } else if (error.error.code == -32603) {
      message_ = error.error.message;
    }

    return [message_, null];
  }
};

const getWinners = async () => {
  try {
    let [signer, account, chainId] = await getSignerAndAccountAndChainId();

    let luckyBaby;

    let currentIssueId;

    if (chainId === 5) {
      luckyBaby = new ethers.Contract(luckyBabyAddress, luckyBabyabi, signer);
      currentIssueId = await luckyBaby.currentIssueId();
      let winners = await luckyBaby.getWinners(currentIssueId);
      return winners;
    }
    return [];
  } catch (error) {
    let message_;
    if (equalityStringIgnoreCase(error.code, "ACTION_REJECTED")) {
      message_ = "User Reject Transaction";
    } else if (equalityStringIgnoreCase(error.code, "CALL_EXCEPTION")) {
      message_ = error.reason;
    } else if (error.code == -32000) {
      message_ = error.message;
    } else if (error.error.code == -32603) {
      message_ = error.error.message;
    }
    alert(message_);
    return null;
  }
};

const redeemPrize = async () => {
  let etherscanURL = await getScanURL();
  try {
    let [signer, account, chainId] = await getSignerAndAccountAndChainId();

    let luckyBaby;

    let currentIssueId;

    if (chainId === 5) {
      luckyBaby = new ethers.Contract(luckyBabyAddress, luckyBabyabi, signer);
      currentIssueId = await luckyBaby.currentIssueId();
      let tx = await luckyBaby.redeemPrize(currentIssueId);
      console.log(" participate ... please await");

      console.log(`Please See: ${etherscanURL}/tx/${tx.hash}`);
      let message_ = `${etherscanURL}/tx/${tx.hash}`;

      return [message_, tx];
    }
  } catch (error) {
    let message_;
    if (equalityStringIgnoreCase(error.code, "ACTION_REJECTED")) {
      message_ = "User Reject Transaction";
    } else if (error.code == -32000) {
      message_ = error.message;
    } else if (error.error.code == -32603) {
      message_ = error.error.message;
    }

    return [message_, null];
  }
};

const getNumberParticipants = async () => {
  try {
    let [signer, account, chainId] = await getSignerAndAccountAndChainId();

    let luckyBaby;

    let currentIssueId;

    if (chainId === 5) {
      luckyBaby = new ethers.Contract(luckyBabyAddress, luckyBabyabi, signer);
      currentIssueId = await luckyBaby.currentIssueId();
      let nunbers = await luckyBaby.getNumberParticipants(currentIssueId);

      return [nunbers[0], nunbers[1]];
    }
    return [null, null];
  } catch (error) {
    return [null, null];
  }
};

const getCurrentIssueIdOpenState = async () => {
  try {
    let [signer, account, chainId] = await getSignerAndAccountAndChainId();

    let luckyBaby;

    let currentIssueId;

    if (chainId === 5) {
      luckyBaby = new ethers.Contract(luckyBabyAddress, luckyBabyabi, signer);
      currentIssueId = await luckyBaby.currentIssueId();
      let issueData = await luckyBaby.issueDatas(currentIssueId);

      return [currentIssueId, issueData.openState];
    }
  } catch (error) {
    return [null, null];
  }
};

export {
  participate,
  getWinners,
  redeemPrize,
  getNumberParticipants,
  getCurrentIssueIdOpenState,
  openPrizePool,
  incrementNewIssue
};
