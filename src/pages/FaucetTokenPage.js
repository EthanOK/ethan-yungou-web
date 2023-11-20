import { useEffect, useState } from "react";
import { getFaucetContract, getERC20Contract } from "../utils/GetContract.js";
import {
  faucet_goerli,
  ygio_goerli,
  ygio_tbsc,
  usdt_goerli,
  usdt_tbsc,
  yulp_tbsc,
  yulp_goerli,
} from "../utils/SystemConfiguration.js";
import { getDecimal, getDecimalBigNumber } from "../utils/Utils.js";
const FaucetTokenPage = () => {
  //   const [tableData, setTableData] = useState([]);

  const [isMounted, setIsMounted] = useState(false);
  const [myYgioBalance, setMyYgioBalance] = useState(0);
  const [myUSDTBalance, setMyUSDTBalance] = useState(0);
  const [myYULPBalance, setMyYULPBalance] = useState(0);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const faucetAmount = "10000";

  useEffect(() => {
    setIsMounted(true);
    const intervalId = setInterval(updateBalance, 5000);
    return () => {
      clearInterval(intervalId);
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      configData();
    }
  }, [isMounted]);

  const configData = async () => {
    try {
      let account = localStorage.getItem("userAddress");
      setCurrentAccount(account);
      await updateBalance();
    } catch (error) {
      console.log(error);
    }
  };

  const updateBalance = async () => {
    try {
      let account = localStorage.getItem("userAddress");
      let chainId = localStorage.getItem("chainId");
      let ygioAddress;
      let usdtAddress;
      let yulpAddress;
      if (chainId == 5) {
        ygioAddress = ygio_goerli;
        usdtAddress = usdt_goerli;
        yulpAddress = yulp_goerli;
      } else if (chainId == 97) {
        ygioAddress = ygio_tbsc;
        usdtAddress = usdt_tbsc;
        yulpAddress = yulp_tbsc;
      }

      let contract = await getERC20Contract(ygioAddress);
      // let ygioBalance = await contract.balanceOf(account, { blockTag: 9926596 });
      let ygioBalance = await contract.balanceOf(account);
      let decimals = await contract.decimals();
      let balanceStandard = getDecimal(ygioBalance, decimals);
      setMyYgioBalance(balanceStandard);

      let usdtcontract = await getERC20Contract(usdtAddress);
      let usdtBalance = await usdtcontract.balanceOf(account);
      let usdtdecimals = await usdtcontract.decimals();
      let usdtbalanceStandard = getDecimal(usdtBalance, usdtdecimals);
      setMyUSDTBalance(usdtbalanceStandard);

      let yulpcontract = await getERC20Contract(yulpAddress);
      let yulpBalance = await yulpcontract.balanceOf(account);
      let yulpdecimals = await yulpcontract.decimals();
      let yulpbalanceStandard = getDecimal(yulpBalance, yulpdecimals);

      setMyYULPBalance(yulpbalanceStandard);
    } catch (error) {
      console.log(error);
    }
  };
  const faucetYGIOHandler = async () => {
    let account = localStorage.getItem("userAddress");
    let chainId = localStorage.getItem("chainId");
    let accountFrom;
    let ygioAddress;
    if (chainId == 5) {
      accountFrom = "0xa002d00E2Db3Aa0a8a3f0bD23Affda03a694D06A";
      ygioAddress = ygio_goerli;
    } else if (chainId == 97) {
      accountFrom = "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2";
      ygioAddress = ygio_tbsc;
    }
    try {
      let faucetContract = await getFaucetContract();
      console.log(
        ygioAddress,
        accountFrom,
        account,
        getDecimalBigNumber(faucetAmount, 18)
      );

      console.log(getDecimalBigNumber(faucetAmount, 18).toString());

      let tx = await faucetContract.faucet(
        ygioAddress,
        accountFrom,
        account,
        getDecimalBigNumber(faucetAmount, 18)
      );

      let result = await tx.wait();
      if (result.status === 1) {
        console.log("Success!");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        await updateBalance();
      } else {
        console.log("Failure!");
      }
    } catch (error) {}
  };

  const faucetUSDTHandler = async () => {
    let account = localStorage.getItem("userAddress");
    let chainId = localStorage.getItem("chainId");
    let accountFrom;
    let usdtAddress;
    let amount;
    if (chainId == 5) {
      accountFrom = "0xa002d00E2Db3Aa0a8a3f0bD23Affda03a694D06A";
      usdtAddress = usdt_goerli;
      amount = getDecimalBigNumber(faucetAmount, 6);
    } else if (chainId == 97) {
      accountFrom = "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2";
      usdtAddress = usdt_tbsc;
      amount = getDecimalBigNumber(faucetAmount, 18);
    }
    try {
      let faucetContract = await getFaucetContract();
      console.log(usdtAddress, accountFrom, account, amount.toString());
      let tx = await faucetContract.faucet(
        usdtAddress,
        accountFrom,
        account,
        amount
      );

      let result = await tx.wait();
      if (result.status === 1) {
        console.log("Success!");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        await updateBalance();
      } else {
        console.log("Failure!");
      }
    } catch (error) {}
  };

  const faucetYULPHandler = async () => {
    let account = localStorage.getItem("userAddress");
    let chainId = localStorage.getItem("chainId");
    let accountFrom;
    let lpAddress;
    let amount;
    if (chainId == 5) {
      accountFrom = "0xa002d00E2Db3Aa0a8a3f0bD23Affda03a694D06A";
      lpAddress = usdt_goerli;
      amount = getDecimalBigNumber(faucetAmount, 6);
    } else if (chainId == 97) {
      accountFrom = "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2";
      lpAddress = yulp_tbsc;
      amount = getDecimalBigNumber(faucetAmount, 18);
    }
    try {
      let faucetContract = await getFaucetContract();
      console.log(lpAddress, accountFrom, account, amount.toString());
      let tx = await faucetContract.faucet(
        lpAddress,
        accountFrom,
        account,
        amount
      );

      let result = await tx.wait();
      if (result.status === 1) {
        console.log("Success!");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        await updateBalance();
      } else {
        console.log("Failure!");
      }
    } catch (error) {}
  };

  const faucetButton = (coinType) => {
    if (coinType == "YGIO") {
      return (
        <button
          onClick={faucetYGIOHandler}
          className="cta-button mint-nft-button"
        >
          Faucet {faucetAmount} YGIO
        </button>
      );
    } else if (coinType == "USDT") {
      return (
        <button
          onClick={faucetUSDTHandler}
          className="cta-button mint-nft-button"
        >
          Faucet {faucetAmount} USDT
        </button>
      );
    } else if (coinType == "LP-YG") {
      return (
        <button
          onClick={faucetYULPHandler}
          className="cta-button mint-nft-button"
        >
          Faucet {faucetAmount} LP
        </button>
      );
    }
  };

  const PleaseLogin = () => {
    return <h2>UnLogin, Please Login</h2>;
  };

  return (
    <center>
      {showAlert && (
        <div className="alert">
          <h1>Claim Successful!</h1>
        </div>
      )}{" "}
      <h1>Please Switch To Goerli OR TBSC</h1>
      <div className="bordered-div">
        <h2>Faucet YGIO</h2>
        <h3>My YGIO Balance: {myYgioBalance}</h3>
        {currentAccount ? faucetButton("YGIO") : PleaseLogin()}
      </div>
      <p></p>
      <div className="bordered-div">
        <h2>Faucet USDT</h2>
        <h3>My USDT Balance: {myUSDTBalance}</h3>
        {currentAccount ? faucetButton("USDT") : PleaseLogin()}
      </div>
      <p></p>
      <div className="bordered-div">
        <h2>Faucet YGIO-USDT LP</h2>
        <h3>My LP Balance: {myYULPBalance}</h3>
        {currentAccount ? faucetButton("LP-YG") : PleaseLogin()}
      </div>
    </center>
  );
};

export default FaucetTokenPage;
