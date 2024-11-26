import { useEffect, useState } from "react";
import {
  isAddress,
  utf8ToHexBytes,
  getScanURL,
  getDecimalBigNumber,
  getInfuraProvider
} from "../utils/Utils.js";
import { getSigner } from "../utils/GetProvider.js";
import { getAccessList } from "../utils/GetAccessListInTx.js";
const CreateTransactionPage = () => {
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

    let hexInputData;
    // 如果是0x前缀
    if (inputDataValue.startsWith("0x")) {
      hexInputData = inputDataValue;
    } else {
      hexInputData = utf8ToHexBytes(inputDataValue);
    }

    console.log(hexInputData);

    try {
      const signer = await getSigner();
      const tx = await signer.sendTransaction({
        to: toValue,
        data: hexInputData,
        value: amountBigNumber
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

  const createTxHandler = async () => {
    const url = await getScanURL();
    const signer = await getSigner();
    const provider = await getInfuraProvider();

    const to = document.getElementById("to_tx").value;

    const value_ = document.getElementById("value_tx").value;

    const data = document.getElementById("data_tx").value;

    const value = getDecimalBigNumber(value_ == "" ? "0" : value_, 18);

    if (to !== "" && !isAddress(to)) {
      alert("To address is not valid");
      return;
    }

    let hexInputData;
    // 如果是0x前缀
    if (!data.startsWith("0x") || data.length % 2 != 0) {
      alert("data is not valid");
      return;
    }
    const transaction = {
      from: await signer.getAddress(),
      // to: to == "" ? null : to,
      data: data
      // value: value.toHexString(),
    };
    const result = await getAccessList(provider, transaction);

    console.log("Access List:", result);

    try {
      const tx = await signer.sendTransaction({
        to: to == "" ? null : to,
        data: data,
        value: value
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

  const createTxButton = () => {
    return (
      <button onClick={createTxHandler} className="cta-button mint-nft-button">
        create Tx
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
      <div className="bordered-div">
        <h2>Transfer ETH/BNB/MATIC</h2>
        <div className="container">
          <div>
            <label className="label-6">To:</label>
            <textarea
              className="textarea"
              id="to"
              placeholder="0xe698a7917eEE4fDf03296add549eE4A7167DD406"
            ></textarea>
          </div>

          <p></p>

          <div>
            <label className="label-6">Value:</label>
            <textarea
              className="textarea"
              id="amount"
              placeholder="0.1"
            ></textarea>
          </div>

          <p></p>

          <div>
            <label className="label-6">Data: </label>
            <textarea
              id="inputData"
              placeholder="你已经被我盯上了，小心点！"
              style={{ height: "60px", width: "400px", fontSize: "14px" }}
            />
          </div>
        </div>
        <p></p>
        {currentAccount ? transferNativeButton() : PleaseLogin()}
      </div>

      <p></p>

      <div className="bordered-div">
        <h2>Create Transaction/Deploy Contract</h2>
        <div className="container">
          <div>
            <label className="label-6">To:</label>
            <textarea
              className="textarea"
              id="to_tx"
              placeholder="0xe698a7917eEE4fDf03296add549eE4A7167DD406"
            ></textarea>
          </div>

          <p></p>

          <div>
            <label className="label-6">Value:</label>
            <textarea
              className="textarea"
              id="value_tx"
              placeholder="0.1"
            ></textarea>
          </div>

          <p></p>

          <div>
            <label className="label-6">Data: </label>
            <textarea
              id="data_tx"
              placeholder="0x"
              style={{ height: "60px", width: "400px", fontSize: "14px" }}
            />
          </div>
        </div>
        <p></p>
        {currentAccount ? createTxButton() : PleaseLogin()}
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

export default CreateTransactionPage;
