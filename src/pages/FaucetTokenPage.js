import { useEffect, useState } from "react";
import {
  getFaucetContract,
  getERC20Contract,
  getERC721Contract
} from "../utils/GetContract.js";
import {
  faucet_goerli,
  ygio_goerli,
  ygio_tbsc,
  usdt_goerli,
  usdt_tbsc,
  yulp_tbsc,
  yulp_goerli,
  ygme_goerli,
  ygme_tbsc,
  ZERO_ADDRESS,
  faucet_sepolia,
  usdt_sepolia,
  ygme_sepolia,
  ygio_sepolia
} from "../utils/SystemConfiguration.js";
import { getDecimal, getDecimalBigNumber } from "../utils/Utils.js";
import { ethers } from "ethers";
import { addSuffixOfTxData } from "../utils/HandleTxData.js";
import { switchChain } from "../utils/GetProvider.js";
import { login } from "../utils/ConnectWallet.js";
const FaucetTokenPage = () => {
  //   const [tableData, setTableData] = useState([]);

  const [isMounted, setIsMounted] = useState(false);
  const [myYgmeBalance, setMyYgmeBalance] = useState(0);
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
      if (window.ethereum) {
        window.ethereum.on("chainChanged", async (chainId) => {
          let chainId_ = Number.parseInt(chainId);
          localStorage.setItem("chainId", chainId_.toString());
        });

        window.ethereum.on("accountsChanged", async (accounts) => {
          let account = accounts[0];

          localStorage.setItem("userAddress", account);
        });
      }
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
      let ygmeAddress;
      let usdtAddress;
      let yulpAddress;
      if (chainId == 5) {
        ygioAddress = ygio_goerli;
        usdtAddress = usdt_goerli;
        yulpAddress = yulp_goerli;
        ygmeAddress = ygme_goerli;
      } else if (chainId == 97) {
        ygioAddress = ygio_tbsc;
        usdtAddress = usdt_tbsc;
        yulpAddress = yulp_tbsc;
        ygmeAddress = ygme_tbsc;
      } else if (chainId == 11155111) {
        usdtAddress = usdt_sepolia;
        ygmeAddress = ygme_sepolia;
        ygioAddress = ygio_sepolia;
      }
      if (ygioAddress) {
        let contract = await getERC20Contract(ygioAddress);
        // let ygioBalance = await contract.balanceOf(account, { blockTag: 9926596 });
        let ygioBalance = await contract.balanceOf(account);
        let decimals = await contract.decimals();
        let balanceStandard = getDecimal(ygioBalance, decimals);

        setMyYgioBalance(balanceStandard);
      }
      if (ygmeAddress) {
        let ygmecontract = await getERC721Contract(ygmeAddress);

        let ygmeBalance = await ygmecontract.balanceOf(account);

        setMyYgmeBalance(ygmeBalance.toString());
      }

      if (usdtAddress) {
        let usdtcontract = await getERC20Contract(usdtAddress);
        let usdtBalance = await usdtcontract.balanceOf(account);
        let usdtdecimals = await usdtcontract.decimals();
        let usdtbalanceStandard = getDecimal(usdtBalance, usdtdecimals);
        setMyUSDTBalance(usdtbalanceStandard);
      }

      if (yulpAddress) {
        let yulpcontract = await getERC20Contract(yulpAddress);
        let yulpBalance = await yulpcontract.balanceOf(account);
        let yulpdecimals = await yulpcontract.decimals();
        let yulpbalanceStandard = getDecimal(yulpBalance, yulpdecimals);

        setMyYULPBalance(yulpbalanceStandard);
      }
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
    } else if (chainId == 11155111) {
      accountFrom = "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2";
      ygioAddress = ygio_sepolia;
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

  const faucetYGMEHandler = async () => {
    let account = localStorage.getItem("userAddress");
    let chainId = localStorage.getItem("chainId");
    let ygmeAddress;
    if (chainId == 5) {
      ygmeAddress = ygme_goerli;
    } else if (chainId == 97) {
      ygmeAddress = ygme_tbsc;
    } else if (chainId == 11155111) {
      ygmeAddress = ygme_sepolia;
    }
    try {
      let faucetContract = await getFaucetContract();

      let calldata = ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256"],
        [account, ZERO_ADDRESS, 10]
      );

      let data = await addSuffixOfTxData("0xdf791e50", calldata);

      let tx = await faucetContract.faucetDatas(ygmeAddress, data);

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
    } catch (error) {
      console.log(error);
    }
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
    } else if (chainId == 11155111) {
      accountFrom = "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2";
      usdtAddress = usdt_sepolia;
      amount = getDecimalBigNumber(faucetAmount, 6);
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
    } else if (coinType == "YGME") {
      return (
        <button
          onClick={faucetYGMEHandler}
          className="cta-button mint-nft-button"
        >
          Faucet 10 YGME
        </button>
      );
    }
  };

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    try {
      if (!ethereum) {
        alert("Please install Metamask");
        console.log("Make sure you have Metamask installed!");
        console.log("`````````````");
        return false;
      } else {
        console.log("Wallet exists! let's go!");

        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const connectandsign = async () => {
    let connect = await checkWalletIsConnected();
    if (!connect) {
      return;
    }

    localStorage.setItem("LoginType", "metamask");
    let chainId = await window.ethereum.request({ method: "eth_chainId" });
    let chainId_local = localStorage.getItem("chainId");
    console.log(chainId_local);
    if (chainId !== chainId_local) {
      let success = await switchChain(chainId_local);
      if (!success) {
        return null;
      }
    }

    let [result, account] = await login();
    if (result) {
      // configAccountData(account);

      localStorage.setItem("userAddress", account);

      setCurrentAccount(account);

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const PleaseLogin = () => {
    // return <h2>UnLogin, Please Login</h2>;
    return (
      <button
        onClick={connectandsign}
        className="cta-button connect-wallet-button"
      >
        Metamask Login
      </button>
    );
  };

  return (
    <center>
      {showAlert && (
        <div className="alert">
          <h1>Claim Successful!</h1>
        </div>
      )}{" "}
      <h1>Please Switch To Goerli OR Sepolia OR TBSC</h1>
      <div className="bordered-div">
        <h2>Faucet YGME</h2>
        <h3>My YGME Balance: {myYgmeBalance}</h3>
        {currentAccount ? faucetButton("YGME") : PleaseLogin()}
      </div>
      <p></p>
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
