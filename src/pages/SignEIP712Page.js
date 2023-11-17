import { useEffect, useState } from "react";

import {
  signEIP712Message,
  signEIP712YunGouMessage,
  signEIP712OpenSeaMessage,
} from "../utils/SignFunc.js";
import { getSignerAndChainId } from "../utils/GetProvider.js";

const SignEIP712Page = () => {
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
  // TODO:signEIP712YunGouHandler
  const signEIP712YunGouHandler = async () => {
    let [signer, chainId] = await getSignerAndChainId();
    let result = await signEIP712YunGouMessage(signer, chainId);
    if (result != false) {
      setMessage(JSON.stringify(result, null, "\t"));
    }
  };

  // TODO:signEIP712OpenSeaHandler
  const signEIP712OpenSeaHandler = async () => {
    const [signer, chainId] = await getSignerAndChainId();

    let result = await signEIP712OpenSeaMessage(signer, chainId);
    if (result != false) {
      setMessage(JSON.stringify(result, null, "\t"));
    }
  };
  // TODO:signTypedDataYunGouButton
  const signTypedDataYunGouButton = () => {
    return (
      <button
        onClick={signEIP712YunGouHandler}
        className="cta-button mint-nft-button"
      >
        signEIP712Message YunGou
      </button>
    );
  };

  // TODO:signTypedDataOpenSeaButton
  const signTypedDataOpenSeaButton = () => {
    return (
      <button
        onClick={signEIP712OpenSeaHandler}
        className="cta-button mint-nft-button"
      >
        signEIP712Message OpenSea
      </button>
    );
  };
  return (
    <center>
      <div>
        <h2>EIP 712</h2>
        {currentAccount ? signTypedDataYunGouButton() : PleaseLogin()}

        <p></p>
        {currentAccount ? signTypedDataOpenSeaButton() : PleaseLogin()}
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

export default SignEIP712Page;
