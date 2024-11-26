import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { getPriceBaseUSDT, getPriceBaseUSDTByBinance } from "../api/GetData.js";
import {
  caculatePriceBySqrtPriceX96,
  getAddressCreate,
  isAddress
} from "../utils/Utils.js";
import { getTokenPrice } from "../utils/GetLpTokenPrice.js";
import { signHexDataMessage } from "../utils/SignFunc.js";
import { getSigner } from "../utils/GetProvider.js";

const UtilsPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [signatureHex, setSignatureHex] = useState("");
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");
  const [message4, setMessage4] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [transactionFee, setTransactionFee] = useState("");
  const [etherPrice, setEtherPrice] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(null);

  const [contractCreate, setContractCreate] = useState(null);

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

      let result = await getPriceBaseUSDTByBinance();
      console.log(result);
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

  const getAddressByCreatHandler = async () => {
    const accountInput = document.getElementById("account_create");
    const accountValue = accountInput.value;
    const nonceInput = document.getElementById("nonce_create");
    const nonceValue = nonceInput.value;
    console.log(accountValue, nonceValue);

    if (isAddress(accountValue)) {
      let address_ = getAddressCreate(accountValue, nonceValue);
      setContractCreate(address_);
    } else {
      console.log("error address");
    }
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
    setMessage("https://ipfs.io/ipfs/" + contractValue);
    setMessage1("https://gateway.pinata.cloud/ipfs/" + contractValue);
    setMessage2("https://cloudflare-ipfs.com/ipfs/" + contractValue);
    setMessage3("https://dweb.link/ipfs/" + contractValue);
    setMessage4("https://ipfs.filebase.io/ipfs/" + contractValue);
  };
  const getSignatureHandler = async () => {
    const contractInput = document.getElementById("hexData");
    const contractValue = contractInput.value;
    const signer = await getSigner();
    try {
      const signatureHex_ = await signHexDataMessage(signer, contractValue);
      setSignatureHex(signatureHex_);
    } catch (error) {
      console.log(error);
      alert("INVALID_ARGUMENT");
    }
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

  const getSignatureButton = () => {
    return (
      <button
        onClick={getSignatureHandler}
        className="cta-button mint-nft-button"
      >
        Sign Hex Data
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
  const getAddressByCreate = () => {
    return (
      <button
        onClick={getAddressByCreatHandler}
        className="cta-button mint-nft-button"
      >
        getContractAddress
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
          <h3>Sign Hex Data</h3>
          <div className="container">
            <div className="input-container">
              <label className="label">Hex Data:</label>
              <textarea
                className="textarea"
                id="hexData"
                placeholder="0xc0e8f831a90406f3a15e808f3f1ec26ea4bc214cfb986cdb4b0623b22bbf8ed3"
                style={{ height: "20px", width: "500px", fontSize: "14px" }}
              ></textarea>
            </div>
          </div>
          <p></p>
          {currentAccount ? getSignatureButton() : PleaseLogin()}
          <div>
            Signature:
            <textarea
              type="text"
              value={signatureHex}
              readOnly
              style={{ width: "400px", height: "60px" }}
            ></textarea>
          </div>
        </div>
        <p></p>
        <div className="bordered-div">
          <h3>IPFS</h3>
          <div className="container">
            <div className="input-container">
              <label className="label">CID:</label>
              <textarea
                className="textarea"
                id="cid"
                placeholder="QmSFZ84W8uNjoZJMkGkVDuJR5PBNtsHorDBmcHCjzACdXY"
                style={{ height: "20px", width: "460px", fontSize: "14px" }}
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
                {message.substring(0, message.lastIndexOf("/") + 2)}
              </a>
              <p></p>
              <a href={message1} target="_blank" rel="noopener noreferrer">
                {message1.substring(0, message1.lastIndexOf("/") + 2)}
              </a>
              <p></p>
              <a href={message2} target="_blank" rel="noopener noreferrer">
                {message2.substring(0, message2.lastIndexOf("/") + 2)}
              </a>
              <p></p>
              <a href={message3} target="_blank" rel="noopener noreferrer">
                {message3.substring(0, message3.lastIndexOf("/") + 2)}
              </a>
              <p></p>
              <a href={message4} target="_blank" rel="noopener noreferrer">
                {message4.substring(0, message4.lastIndexOf("/") + 2)}
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

        <p></p>
        <div className="bordered-div">
          <h3>Get Contract Address(By Create)</h3>
          <div>
            <label className="label">Account:</label>
            <textarea
              className="textarea"
              id="account_create"
              placeholder="0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2"
              style={{ height: "20px", width: "320px", fontSize: "14px" }}
            ></textarea>
            <p></p>
            <label className="label">Nonce:</label>
            <textarea
              className="textarea"
              id="nonce_create"
              placeholder="11"
              style={{ height: "20px", width: "320px", fontSize: "14px" }}
            ></textarea>
            <p></p>
            {currentAccount ? getAddressByCreate() : PleaseLogin()}
            <p>Contract Address: &nbsp;&nbsp;{contractCreate}</p>
          </div>
        </div>
      </div>
      <div>
        <p></p>
      </div>
    </center>
  );
};

export default UtilsPage;
