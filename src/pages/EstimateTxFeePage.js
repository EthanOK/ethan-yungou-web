import { useEffect, useState } from "react";
import { isAddress, getDecimalBigNumber } from "../utils/Utils.js";
import { getProvider, getSigner } from "../utils/GetProvider.js";
import { estimateTxFee } from "../utils/EstimateTxFee.js";
const EstimateTxFeePage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);

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
    let account = localStorage.getItem("userAddress");
    if (account != null) {
      setCurrentAccount(account);
    }
  };

  const PleaseLogin = () => {
    return <h2>UnLogin, Please Login</h2>;
  };

  const estimateTxFeeHandler = async () => {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const value = document.getElementById("value").value;
    const data = document.getElementById("data").value;

    const value_ = getDecimalBigNumber(value == "" ? "0" : value, 18);

    if (!isAddress(from) || !isAddress(to)) {
      alert("address is not valid");
      return;
    }

    if (!data.startsWith("0x")) {
      alert("data is not valid");
      return;
    }

    try {
      const provider = await getProvider();

      const result = await estimateTxFee(provider, from, to, data, value_);

      console.log(result);

      setMessage(JSON.stringify(result));
    } catch (error) {
      alert(error.code);
    }
  };

  const estimateTxFeeButton = () => {
    return (
      <button
        onClick={estimateTxFeeHandler}
        className="cta-button mint-nft-button"
      >
        estimate txFee
      </button>
    );
  };

  return (
    <center>
      <div>
        <h2>EstimateTxFee</h2>
        <div className="container">
          <div>
            <label className="label-6">from:</label>
            <textarea
              className="textarea"
              id="from"
              placeholder="0xe698a7917eEE4fDf03296add549eE4A7167DD406"
            ></textarea>
          </div>
          <p></p>

          <div>
            <label className="label-6">to:</label>
            <textarea
              className="textarea"
              id="to"
              placeholder="0xe698a7917eEE4fDf03296add549eE4A7167DD406"
            ></textarea>
          </div>
          <p></p>
          <div>
            <label className="label-6">value:</label>
            <textarea
              className="textarea"
              id="value"
              placeholder="0.1"
            ></textarea>
          </div>

          <p></p>
          <div>
            <label className="label-6">data:</label>
            <textarea
              id="data"
              placeholder="0x"
              style={{ height: "100px", width: "400px", fontSize: "14px" }}
            />
          </div>
        </div>
        <p></p>
        {currentAccount ? estimateTxFeeButton() : PleaseLogin()}
      </div>
      <div>
        <h2>
          Please See:
          <p></p>
          <a href={message} target="_blank" rel="noopener noreferrer">
            {message}
          </a>
        </h2>
      </div>
    </center>
  );
};

export default EstimateTxFeePage;
