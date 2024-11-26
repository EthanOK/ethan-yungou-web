import { useEffect, useState } from "react";
import {
  getFaucetContract,
  getERC20Contract,
  getCrossChainContract
} from "../utils/GetContract.js";

import { getDecimal, getDecimalBigNumber, isAddress } from "../utils/Utils.js";
import { BigNumber, ethers, utils } from "ethers";
import {
  crossChain_goerli,
  crossChain_tbsc,
  ygio_goerli,
  ygio_tbsc
} from "../utils/SystemConfiguration.js";
import { getClaimYGIOBalance, getCrossChainSignature } from "../api/GetData.js";
import { changeCrossChainDatas } from "../api/ChangeData.js";
import { switchChain } from "../utils/GetProvider.js";
const CrossChainBridgePage = () => {
  //  const [tableData, setTableData] = useState([]);

  const [isMounted, setIsMounted] = useState(false);
  const [tokenAddress, setTokenAddress] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [chainId, setChainId] = useState(null);

  const [toChainId, setToChainId] = useState(null);

  const [balanceOfCC_T, setBalanceOfCC_T] = useState(null);
  const [balanceOfCC_G, setBalanceOfCC_G] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    // const intervalId = setInterval(updateChianId, 5000);
    return () => {
      // clearInterval(intervalId);
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
      let chainId = localStorage.getItem("chainId");
      setChainId(chainId);
      if (chainId == 5 || Number(chainId) == 5) {
        setToChainId(97);
      } else if (chainId == 97 || Number(chainId) == 97) {
        setToChainId(5);
      }

      let _balanceData_T = await getClaimYGIOBalance(97);
      setBalanceOfCC_T(ethers.utils.formatEther(_balanceData_T.data.balance));
      let _balanceData_G = await getClaimYGIOBalance(5);
      setBalanceOfCC_G(ethers.utils.formatEther(_balanceData_G.data.balance));
    } catch (error) {
      console.log(error);
    }
  };

  const claimTokenHandler_TBSC = async () => {
    try {
      if (chainId != 97) {
        alert("Must TBSC");
        let success = await switchChain(97);
        if (!success) {
          return null;
        }
        localStorage.setItem("chainId", 97);
        // 刷新页面
        window.location.reload();
        return;
      }

      const amountClaimInput = document.getElementById("amountClaim");
      const amountValue = amountClaimInput.value;
      let ccAddress = crossChain_tbsc;
      let crossChainContract = await getCrossChainContract(ccAddress);

      let _amountValue = utils.parseEther(amountValue);

      // 请求后端
      let resultData = await getCrossChainSignature(
        chainId,
        1,
        _amountValue.toString()
      );

      if (resultData.code !== 200) {
        alert(resultData.message);
        return;
      }

      let paras = resultData.data;

      let tx = await crossChainContract.mintYGIO(
        paras.orderId,
        currentAccount,
        paras.amount,
        paras.deadline,
        paras.signature
      );

      let result = await tx.wait();
      if (result.status === 1) {
        console.log("Claim Success!");

        let resultData_ = await changeCrossChainDatas(
          chainId,
          1,
          _amountValue.toString(),
          toChainId
        );

        console.log(resultData_);

        setBalanceOfCC_T(ethers.utils.formatEther(resultData_.data.balance));

        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);

        // await getBalanceHandler();
      } else {
        console.log("Failure!");
      }
    } catch (error) {}
  };

  const claimTokenHandler_G = async () => {
    try {
      if (chainId != 5) {
        alert("Must Goerli");
        let success = await switchChain(5);
        if (!success) {
          return null;
        }
        localStorage.setItem("chainId", 5);
        // 刷新页面
        window.location.reload();
        return;
      }

      const amountClaimInput = document.getElementById("amountClaim_G");
      const amountValue = amountClaimInput.value;
      let ccAddress = crossChain_goerli;
      let crossChainContract = await getCrossChainContract(ccAddress);

      let _amountValue = utils.parseEther(amountValue);

      // 请求后端
      let resultData = await getCrossChainSignature(
        chainId,
        1,
        _amountValue.toString()
      );

      if (resultData.code !== 200) {
        alert(resultData.message);
        return;
      }

      let paras = resultData.data;

      let tx = await crossChainContract.mintYGIO(
        paras.orderId,
        currentAccount,
        paras.amount,
        paras.deadline,
        paras.signature
      );

      let result = await tx.wait();
      if (result.status === 1) {
        console.log("Claim Success!");

        let resultData_ = await changeCrossChainDatas(
          chainId,
          1,
          _amountValue.toString(),
          toChainId
        );

        console.log(resultData_);

        setBalanceOfCC_G(ethers.utils.formatEther(resultData_.data.balance));

        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);

        // await getBalanceHandler();
      } else {
        console.log("Failure!");
      }
    } catch (error) {}
  };

  const sendGYGIOHandler_G = async () => {
    let account = localStorage.getItem("userAddress");

    const amountInput = document.getElementById("amountSend");
    const amountValue = amountInput.value;

    let ygioAddress = ygio_goerli;
    let ccAddress = crossChain_goerli;

    if (chainId != 5) {
      alert("Must Goerli");
      let success = await switchChain(5);
      if (!success) {
        return null;
      }
      localStorage.setItem("chainId", 5);
      // 刷新页面
      window.location.reload();
      return;
    }

    let erc20contract = await getERC20Contract(ygioAddress);
    let allowance = await erc20contract.allowance(account, ccAddress);

    let _amountValue = utils.parseEther(amountValue);

    try {
      if (allowance.lt(_amountValue)) {
        let txApp = await erc20contract.approve(ccAddress, _amountValue);
        let result = await txApp.wait();
        if (result.status === 1) {
          await sendYGIO(ccAddress, _amountValue, 97);
        }
      } else {
        await sendYGIO(ccAddress, _amountValue, 97);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendGYGIOHandler_T = async () => {
    let account = localStorage.getItem("userAddress");

    const amountInput = document.getElementById("amountSend_T");
    const amountValue = amountInput.value;

    let ygioAddress = ygio_tbsc;
    let ccAddress = crossChain_tbsc;

    if (chainId != 97) {
      alert("Must TBSC");
      let success = await switchChain(97);
      if (!success) {
        return null;
      }
      localStorage.setItem("chainId", 97);
      // 刷新页面
      window.location.reload();
      return;
    }

    let erc20contract = await getERC20Contract(ygioAddress);
    let allowance = await erc20contract.allowance(account, ccAddress);

    let _amountValue = utils.parseEther(amountValue);

    try {
      if (allowance.lt(_amountValue)) {
        let txApp = await erc20contract.approve(ccAddress, _amountValue);
        let result = await txApp.wait();
        if (result.status === 1) {
          await sendYGIO(ccAddress, _amountValue, 5);
        }
      } else {
        await sendYGIO(ccAddress, _amountValue, 5);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendYGIO = async (ccAddress, amountValue, toChainId) => {
    try {
      let crossChainContract = await getCrossChainContract(ccAddress);

      // 请求后端
      let resultData = await getCrossChainSignature(
        chainId,
        2,
        amountValue.toString()
      );
      console.log(resultData);

      if (resultData.code !== 200) {
        alert(resultData.message);
        return;
      }
      let paras = resultData.data;

      let tx = await crossChainContract.burnYGIO(
        paras.orderId,
        paras.amount,
        paras.deadline,
        paras.signature
      );

      let result = await tx.wait();
      if (result.status === 1) {
        console.log("Success!");

        // post user send data
        let resultData_ = await changeCrossChainDatas(
          chainId,
          2,
          amountValue.toString(),
          toChainId
        );

        console.log(resultData_);
        if (toChainId == 97) {
          setBalanceOfCC_T(ethers.utils.formatEther(resultData_.data.balance));
        } else if (toChainId == 5) {
          setBalanceOfCC_G(ethers.utils.formatEther(resultData_.data.balance));
        }

        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);

        // await getBalanceHandler();
      } else {
        console.log("Failure!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBalanceHandler = async () => {
    let account = localStorage.getItem("userAddress");

    const addressInput = document.getElementById("addressString");
    const addressValue = addressInput.value;
    let res;
    if (addressInput.length == 44) {
      res = isAddress(JSON.parse(addressValue));
    } else {
      res = isAddress(addressValue);
    }
    if (!res) {
      alert("地址错误");
      return;
    }

    let erc20contract = await getERC20Contract(addressValue);

    let tokenBalance = await erc20contract.balanceOf(account);
    setTokenAddress(addressValue);
    setTokenBalance(tokenBalance);
  };

  const claimTokenButton = (type) => {
    if (type == "inGoerli") {
      return (
        <button
          onClick={claimTokenHandler_G}
          className="cta-button mint-nft-button"
        >
          Claim YGIO(inGoerli)
        </button>
      );
    } else if (type == "inTBSC") {
      return (
        <button
          onClick={claimTokenHandler_TBSC}
          className="cta-button mint-nft-button"
        >
          Claim YGIO(inTBSC)
        </button>
      );
    }
  };

  const sendButton = (type) => {
    if (type === "toTBSC") {
      return (
        <button
          onClick={sendGYGIOHandler_G}
          className="cta-button mint-nft-button"
        >
          Send YGIO (toTBSC)
        </button>
      );
    } else if (type === "toGoerli") {
      return (
        <button
          onClick={sendGYGIOHandler_T}
          className="cta-button mint-nft-button"
        >
          Send YGIO (toGoerli)
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
      <h2>Cross-Chain Bridge(YGIO)</h2>
      <div>
        <div className="bordered-div">
          <h2>Goerli {"==>"} TBSC </h2>
          <div>
            <label>Send YGIO Amount:&nbsp;</label>
            <textarea
              id="amountSend"
              placeholder="10000"
              style={{ height: "24px", width: "400px", fontSize: "16px" }}
            />
          </div>
          <p></p>

          {currentAccount ? sendButton("toTBSC") : PleaseLogin()}

          <p></p>
          <div>
            <p>Balance: {balanceOfCC_T}</p>
            <label>Claim YGIO Amount: &nbsp;</label>
            <textarea
              id="amountClaim"
              defaultValue={balanceOfCC_T}
              style={{ height: "24px", width: "400px", fontSize: "16px" }}
            />
            <p> </p>
          </div>

          {currentAccount ? claimTokenButton("inTBSC") : PleaseLogin()}
        </div>
      </div>
      <p></p>
      <div>
        <div className="bordered-div">
          <h2> TBSC {"==>"} Goerli </h2>
          <div>
            <label>Send YGIO Amount:&nbsp;</label>
            <textarea
              id="amountSend_T"
              placeholder="10000"
              style={{ height: "24px", width: "400px", fontSize: "16px" }}
            />
          </div>
          <p></p>

          {currentAccount ? sendButton("toGoerli") : PleaseLogin()}

          <p></p>
          <div>
            <p>Balance: {balanceOfCC_G}</p>
            <label>Claim YGIO Amount: &nbsp;</label>
            <textarea
              id="amountClaim_G"
              defaultValue={balanceOfCC_G}
              style={{ height: "24px", width: "400px", fontSize: "16px" }}
            />
          </div>

          {currentAccount ? claimTokenButton("inGoerli") : PleaseLogin()}
        </div>
        <div>
          <p></p>{" "}
        </div>
      </div>
    </center>
  );
};

export default CrossChainBridgePage;
