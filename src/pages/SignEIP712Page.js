import { useEffect, useState } from "react";

import {
  signEIP712Message,
  signEIP712YunGouMessage,
  signEIP712OpenSeaMessage,
  signBlurLoginMessage,
} from "../utils/SignFunc.js";
import { getSignerAndChainId } from "../utils/GetProvider.js";
import { getBlurAccessToken, getBlurLoginMessage } from "../api/GetData.js";

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

  // TODO:signLoginBlurHandler
  const signLoginBlurHandler = async () => {
    const [signer, chainId] = await getSignerAndChainId();
    const loginData = await getBlurLoginMessage(await signer.getAddress());
    if (loginData == null) {
      alert("获取登陆信息是失败");
      return;
    }
    // message: "",
    // walletAddress: '0xc675897bb91797eaea7584f025a5533dbb13a000',
    // expiresOn: '2024-01-03T09:17:09.199Z',
    // hmac: '5989537f3e232e8fb66661eb60a605b4cc2d4a6c047b02686c7d6eb274bbc0d4'
    const messageString = loginData.message;
    let result = await signBlurLoginMessage(signer, messageString);

    const requestData = {
      message: loginData.message,
      walletAddress: loginData.walletAddress,
      expiresOn: loginData.expiresOn,
      hmac: loginData.hmac,
      signature: result,
    };
    const blurAccessToken = await getBlurAccessToken(requestData);
    console.log(blurAccessToken);
    localStorage.setItem("blurAccessToken", blurAccessToken);

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

  const signLoginBlurButton = () => {
    return (
      <button
        onClick={signLoginBlurHandler}
        className="cta-button mint-nft-button"
      >
        sign Login Blur
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

        <p></p>
        {currentAccount ? signLoginBlurButton() : PleaseLogin()}
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
