import { useEffect, useState } from "react";
import { isAddress } from "../utils/Utils.js";
import { getOrderHashSignatureOpenSea } from "../api/GetData.js";

const GetOpenSeaDataPage = () => {
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

  const getOrderHashAndSignatureHandler = async () => {
    const contractInput = document.getElementById("contract");
    const contractValue = contractInput.value;
    const tokenIdInput = document.getElementById("tokenId");
    const tokenIdValue = tokenIdInput.value;
    let res;
    if (contractValue.length == 44) {
      res = isAddress(JSON.parse(contractValue));
    } else {
      res = isAddress(contractValue);
    }
    if (!res) {
      alert("地址错误");
      return;
    }
    let chainId = localStorage.getItem("chainId");
    let result = await getOrderHashSignatureOpenSea(
      chainId,
      contractValue,
      tokenIdValue
    );

    if (result.code !== 200) {
      alert(result.message);
      return;
    }
    setMessage(JSON.stringify(result.data, null, "\t"));
  };

  const getOrderHashAndSignatureButton = () => {
    return (
      <button
        onClick={getOrderHashAndSignatureHandler}
        className="cta-button mint-nft-button"
      >
        getOrderHashAndSignature
      </button>
    );
  };

  return (
    <center>
      <div>
        <h2>OpenSea Data</h2>
        <div className="container">
          <div className="input-container">
            <label className="label" htmlFor="contract">
              contract:
            </label>
            <textarea
              className="textarea"
              id="contract"
              placeholder="0xEAAfcC17f28Afe5CdA5b3F76770eFb7ef162D20b"
            ></textarea>
          </div>

          <div className="input-container">
            <label className="label" htmlFor="tokenId">
              tokenId:
            </label>
            <textarea
              className="textarea"
              id="tokenId"
              placeholder="100"
            ></textarea>
          </div>
        </div>
        <p></p>
        {currentAccount ? getOrderHashAndSignatureButton() : PleaseLogin()}
      </div>
      <div>
        <h2>
          Please See:
          <p></p>
          <textarea
            type="text"
            value={message}
            readOnly
            style={{ width: "1200px", height: "100px" }}
          ></textarea>
        </h2>
      </div>
    </center>
  );
};

export default GetOpenSeaDataPage;
