import { useEffect, useState } from "react";

import {
  signEIP712Message,
  signEIP712YunGouMessage,
  signEIP712OpenSeaMessage,
  signBlurLoginMessage,
  signBulkOrderOpenSeaMessage,
  signCustomBulkOrderMessage
} from "../utils/SignFunc.js";
import { getSignerAndChainId } from "../utils/GetProvider.js";
import {
  getBlurAccessToken,
  getBlurAccessTokenByNFTGO,
  getBlurLoginMessage,
  getBlurLoginMessageByNFTGO
} from "../api/GetData.js";
import { Seaport } from "@opensea/seaport-js";

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

  // TODO:signBulkOrderOpenSeaHandler
  const signBulkOrderOpenSeaHandler = async () => {
    const [signer, chainId] = await getSignerAndChainId();
    const orders = await signBulkOrderOpenSeaMessage(signer, chainId);
    console.log(orders);
    if (orders.length > 0) {
      setMessage(JSON.stringify(orders, null, "\t"));
    }
  };

  // TODO:
  const signBulkOrdersHandler = async () => {
    const [signer, chainId] = await getSignerAndChainId();
    const orders = await signCustomBulkOrderMessage(signer, chainId);
    console.log(orders);
    if (orders.length > 0) {
      setMessage(JSON.stringify(orders, null, "\t"));
    }
  };

  // TODO:signLoginBlurHandler
  const signLoginBlurHandler = async () => {
    const [signer, chainId] = await getSignerAndChainId();
    const loginData = await getBlurLoginMessageByNFTGO(
      await signer.getAddress()
    );
    if (loginData == null) {
      alert("获取登陆信息是失败");
      return;
    }
    // 获取本地时间
    const localTime = new Date(loginData.expiresOn).toLocaleString();
    console.log(localTime);
    // message: "",
    // walletAddress: '0xc675897bb91797eaea7584f025a5533dbb13a000',
    // expiresOn: '2024-01-03T09:17:09.199Z',
    // hmac: '5989537f3e232e8fb66661eb60a605b4cc2d4a6c047b02686c7d6eb274bbc0d4'
    const messageString = loginData.message;
    let result = await signBlurLoginMessage(signer, messageString);

    console.log(localTime);
    const requestData = {
      message: loginData.message,
      walletAddress: loginData.walletAddress,
      expiresOn: loginData.expiresOn,
      hmac: loginData.hmac,
      signature: result
    };

    const blurAccessToken = await getBlurAccessTokenByNFTGO(requestData);
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

  // TODO:signBulkOrderOpenSeaButton
  const signBulkOrderOpenSeaButton = () => {
    return (
      <button
        onClick={signBulkOrderOpenSeaHandler}
        className="cta-button mint-nft-button"
      >
        signBulkOrder OpenSea
      </button>
    );
  };

  const signBulkOrdersButton = () => {
    return (
      <button
        onClick={signBulkOrdersHandler}
        className="cta-button mint-nft-button"
      >
        signCustomBulkOrders
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
        {currentAccount ? signBulkOrderOpenSeaButton() : PleaseLogin()}

        <p></p>
        {currentAccount ? signBulkOrdersButton() : PleaseLogin()}

        <p></p>
        {/* {currentAccount ? signLoginBlurButton() : PleaseLogin()} */}
      </div>
      <div>
        <h2>
          Please See:
          <p></p>
          <textarea
            type="text"
            value={message}
            readOnly
            style={{ width: "1200px", height: "280px" }}
          ></textarea>
        </h2>
      </div>
    </center>
  );
};

export default SignEIP712Page;
