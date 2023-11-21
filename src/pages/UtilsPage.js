import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { getPriceBaseUSDT } from "../api/GetData.js";
import { caculatePriceBySqrtPriceX96 } from "../utils/Utils.js";
import { getTokenPrice } from "../utils/GetLpTokenPrice.js";

const UtilsPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [transactionFee, setTransactionFee] = useState("");
  const [etherPrice, setEtherPrice] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(null);

  const [lpTokenPrice, setLpTokenPrice] = useState(null);
  const [selectedValue, setSelectedValue] = useState("1");

  useEffect(() => {
    setIsMounted(true);
    return () => {
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
      if (account != null) {
        setCurrentAccount(account);
      }

      let result = await getPriceBaseUSDT();
      if (result.code == 200) {
        let data = result.data;
        setEtherPrice(data.ethPrice);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const PleaseLogin = () => {
    return <h2>UnLogin, Please Login</h2>;
  };

  // caculatePriceBySqrtPriceX96

  const getPriceHandler = async () => {
    const sqrtPriceX96Input = document.getElementById("sqrtPriceX96");
    const sqrtPriceX96Value = sqrtPriceX96Input.value;
    let price = caculatePriceBySqrtPriceX96(sqrtPriceX96Value);
    setTokenPrice(price);
  };

  const getTokenPriceHandler = async () => {
    const token0Input = document.getElementById("token0");
    const token0Value = token0Input.value;
    const token1Input = document.getElementById("token1");
    const token1Value = token1Input.value;
    console.log(selectedValue);

    console.log(token0Value, token1Value);

    try {
      let pairPrice = await getTokenPrice(
        selectedValue,
        token0Value,
        token1Value
      );
      setLpTokenPrice(pairPrice);
    } catch (error) {
      console.log(error);
    }
  };

  const getIPFSURLHandler = async () => {
    const contractInput = document.getElementById("cid");
    const contractValue = contractInput.value;
    let url = "https://ipfs.io/ipfs/" + contractValue;
    setMessage(url);
  };

  const calculateTxFeeHandler = async () => {
    const gasUsedInput = document.getElementById("gasUsed");
    const gasUsedValue = gasUsedInput.value;
    const gasPriceInput = document.getElementById("gasPrice");
    const gasPriceValue = gasPriceInput.value;
    // Gwei to Wei
    const gasPrice = ethers.utils.parseUnits(gasPriceValue, "gwei");
    // calculate Transaction Fee

    const txFee = BigNumber.from(gasUsedValue).mul(gasPrice);
    // wei to ether
    const txFeeEther = ethers.utils.formatEther(txFee);
    setTransactionFee(txFeeEther);
  };

  const handleChangeValue = (event) => {
    setSelectedValue(event.target.value);
  };

  const getIPFSURLButton = () => {
    return (
      <button
        onClick={getIPFSURLHandler}
        className="cta-button mint-nft-button"
      >
        getIPFSURL
      </button>
    );
  };

  const getPriceButton = () => {
    return (
      <button onClick={getPriceHandler} className="cta-button mint-nft-button">
        getPrice
      </button>
    );
  };

  const getTokenPriceButton = () => {
    return (
      <button
        onClick={getTokenPriceHandler}
        className="cta-button mint-nft-button"
      >
        getTokenPrice
      </button>
    );
  };

  const calculateTxFeeButton = () => {
    return (
      <button
        onClick={calculateTxFeeHandler}
        className="cta-button mint-nft-button"
      >
        calculate TxFee
      </button>
    );
  };

  return (
    <center>
      <div>
        <h2>Utils</h2>

        <div className="bordered-div">
          <h3>IPFS</h3>
          <div className="container">
            <div className="input-container">
              <label className="label">CID:</label>
              <textarea
                className="textarea"
                id="cid"
                placeholder="QmSFZ84W8uNjoZJMkGkVDuJR5PBNtsHorDBmcHCjzACdXY"
                style={{ height: "20px", width: "360px", fontSize: "14px" }}
              ></textarea>
            </div>
          </div>
          <p></p>
          {currentAccount ? getIPFSURLButton() : PleaseLogin()}
          <div>
            <h2>
              Please See:
              <p></p>
              <a href={message} target="_blank" rel="noopener noreferrer">
                {message}
              </a>
            </h2>
          </div>
        </div>
        <p></p>
        <div className="bordered-div">
          <h3>计算 Gas</h3>
          <div className="container">
            <div className="input-container">
              <label className="label">Gas Used:</label>
              <textarea
                id="gasUsed"
                placeholder="158170"
                style={{ height: "20px", width: "360px", fontSize: "14px" }}
              ></textarea>
            </div>{" "}
            <div className="input-container">
              <label className="label">Gas Price(Gwei):</label>
              <textarea
                id="gasPrice"
                placeholder="1.5"
                style={{ height: "20px", width: "300px", fontSize: "14px" }}
              ></textarea>
            </div>
          </div>
          <p></p>
          {currentAccount ? calculateTxFeeButton() : PleaseLogin()}
          <div>
            <h3>
              TxFee: &nbsp;&nbsp;
              <a target="_blank" rel="noopener noreferrer">
                {transactionFee} ether
              </a>
              <p></p>
              <a target="_blank" rel="noopener noreferrer">
                {(parseFloat(transactionFee) * parseFloat(etherPrice)).toFixed(
                  4
                )}
                &nbsp; USD
              </a>
            </h3>
          </div>
        </div>

        <p></p>
        <div className="bordered-div">
          <h3>SqrtPriceX96</h3>
          <div>
            <label className="label">sqrtPriceX96:</label>
            <textarea
              className="textarea"
              id="sqrtPriceX96"
              placeholder="5379665721256550655574226248"
              style={{ height: "20px", width: "300px", fontSize: "14px" }}
            ></textarea>
            <p></p>
            {currentAccount ? getPriceButton() : PleaseLogin()}
            <p>Price: &nbsp;&nbsp;{tokenPrice}</p>
          </div>
        </div>

        <p></p>
        <div className="bordered-div">
          <h3>LPToken Price V2</h3>
          <div>
            <label className="label">platform:</label>

            <select
              id="mintAmount"
              style={{ width: "160px", height: "30px", fontSize: "12px" }}
              value={selectedValue} // 设置当前选中的值
              onChange={handleChangeValue} // 添加事件处理函数
            >
              <option value="1" style={{ textAlign: "center" }}>
                UniSwap V2(ETH)
              </option>
              <option value="56" style={{ textAlign: "center" }}>
                PancakeSwap V2(BSC)
              </option>
            </select>

            <p></p>
            <label className="label">Token0:</label>
            <textarea
              className="textarea"
              id="token0"
              placeholder="0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
              style={{ height: "20px", width: "320px", fontSize: "14px" }}
            ></textarea>
            <p></p>
            <label className="label">Token1:</label>
            <textarea
              className="textarea"
              id="token1"
              placeholder="0xdAC17F958D2ee523a2206206994597C13D831ec7"
              style={{ height: "20px", width: "320px", fontSize: "14px" }}
            ></textarea>
            <p></p>
            {currentAccount ? getTokenPriceButton() : PleaseLogin()}
            <p>LP Price: &nbsp;&nbsp;{lpTokenPrice}</p>
          </div>
        </div>
      </div>
      <div>
        <p></p>{" "}
      </div>
    </center>
  );
};

export default UtilsPage;
