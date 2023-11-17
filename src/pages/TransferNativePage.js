import { useEffect, useState } from "react";
import {
  isAddress,
  utf8ToHexBytes,
  getScanURL,
  getDecimalBigNumber,
} from "../utils/Utils.js";
import { getSigner } from "../utils/GetProvider.js";
const TransferNativePage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
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

  const transferNativeHandler = async () => {
    const url = await getScanURL();
    const inputDataInput = document.getElementById("inputData");
    const inputDataValue = inputDataInput.value;
    const toInput = document.getElementById("to");
    const toValue = toInput.value;
    const amountInput = document.getElementById("amount");
    const amountValue = amountInput.value;
    let amount = amountValue == "" ? "0" : amountValue;

    let amountBigNumber = getDecimalBigNumber(amount, 18);

    if (!isAddress(toValue)) {
      alert("To address is not valid");
      return;
    }
    const hexInputData = utf8ToHexBytes(inputDataValue);

    try {
      const signer = await getSigner();
      const tx = await signer.sendTransaction({
        to: toValue,
        data: hexInputData,
        value: amountBigNumber,
      });
      setMessage(`${url}/tx/${tx.hash}`);
      let txReceipt = await tx.wait();
      if (txReceipt.status === 1) {
        console.log("Success!");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } else {
        console.log("Failure!");
      }
    } catch (error) {
      alert(error.code);
    }
  };

  const transferNativeButton = () => {
    return (
      <button
        onClick={transferNativeHandler}
        className="cta-button mint-nft-button"
      >
        transfer
      </button>
    );
  };

  return (
    <center>
      {showAlert && (
        <div className="alert">
          <h1>"transfer success"</h1>
        </div>
      )}
      <div>
        <h2>Transfer ETH/BNB/MATIC</h2>
        <div className="container">
          <label>InputData: </label>
          <textarea
            id="inputData"
            placeholder="你已经被我盯上了，小心点！"
            style={{ height: "50px", width: "500px", fontSize: "14px" }}
          />

          <label className="label">To:</label>
          <textarea
            className="textarea"
            id="to"
            placeholder="0xe698a7917eEE4fDf03296add549eE4A7167DD406"
          ></textarea>

          <label className="label">Amount:</label>
          <textarea
            className="textarea"
            id="amount"
            placeholder="0.1"
          ></textarea>
        </div>
        <p></p>
        {currentAccount ? transferNativeButton() : PleaseLogin()}
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

export default TransferNativePage;
