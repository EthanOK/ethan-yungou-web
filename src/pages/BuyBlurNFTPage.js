import { useEffect, useState } from "react";
import { isAddress, stringToArray } from "../utils/Utils.js";
import {
  getBlurAccessTokenByNFTGO,
  getBlurAccessTokenByOpensea,
  getBlurLoginMessageByNFTGO,
  getBlurLoginMessageByOpensea
} from "../api/GetData.js";
import { signBlurLoginMessage } from "../utils/SignFunc.js";
import {
  getSignerAndAccountAndChainId,
  getSignerAndChainId
} from "../utils/GetProvider.js";
import { getBlurCalldata } from "../utils/GetBlurCallData.js";
import { onlyBuyBlurNFT } from "../utils/BlurFunc.js";

const BuyBlurNFTPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [blurAccessToken, setBlurAccessToken] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    const intervalId = setInterval(updateData, 2000);
    return () => {
      clearInterval(intervalId);
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      configData();
    }
  }, [isMounted]);

  const updateData = async () => {
    let account = localStorage.getItem("userAddress");
    if (account != null) {
      setCurrentAccount(account);
    }
    let blurAccessToken = localStorage.getItem("blurAccessToken");

    setBlurAccessToken(blurAccessToken);
  };

  const configData = async () => {
    let account = localStorage.getItem("userAddress");
    if (account != null) {
      setCurrentAccount(account);
    }
  };

  const PleaseLogin = () => {
    return (
      <button className="cta-button unlogin-nft-button">PleaseLoginBlur</button>
    );
  };

  // TODO:loginBlurHandler
  const loginBlurHandler = async () => {
    const [signer, account, chainId] = await getSignerAndAccountAndChainId();
    // TODO: getBlurLoginMessageByOpensea
    // const loginData = await getBlurLoginMessageByOpensea(
    //   await signer.getAddress()
    // );
    // TODO: getBlurLoginMessageByNFTGO
    const loginData = await getBlurLoginMessageByNFTGO(
      await signer.getAddress()
    );

    console.log(loginData);
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

    if (result == null) return;

    console.log(localTime);
    const requestData = {
      message: loginData.message,
      walletAddress: loginData.walletAddress,
      expiresOn: loginData.expiresOn,
      hmac: loginData.hmac,
      signature: result
    };
    // // TODO:getBlurAccessTokenByNFTGO
    // const blurAccessToken = await getBlurAccessTokenByOpensea(requestData);
    // console.log(blurAccessToken);
    // TODO:getBlurAccessTokenByNFTGO
    const blurAccessToken = await getBlurAccessTokenByNFTGO(requestData);
    console.log(blurAccessToken);

    if (blurAccessToken == null) {
      alert("登陆失败");
      return;
    }

    localStorage.setItem("userAddress", account);
    localStorage.setItem("chainId", chainId);
    localStorage.setItem("blurAccessToken", blurAccessToken);

    if (result != false) {
      setMessage(JSON.stringify(result, null, "\t"));
    }
  };

  const buyBlurNFTHandler = async () => {
    const contract = document.getElementById("contract").value;
    const tokenId = document.getElementById("tokenId").value;
    if (!isAddress(contract)) {
      alert("contract is not address");
      return;
    }
    if (tokenId == "") {
      alert("tokenId is empty");
      return;
    }
    try {
      let blurAccessToken = localStorage.getItem("blurAccessToken");
      const [message_, tx] = await onlyBuyBlurNFT(
        contract,
        tokenId,
        currentAccount,
        blurAccessToken
      );
      if (message_ != null) {
        setMessage(message_);
        let rsult = await tx.wait();
        if (rsult.status === 1) {
          console.log("Success!");
        } else {
          console.log("Failure!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loginBlurButton = () => {
    return (
      <button onClick={loginBlurHandler} className="cta-button mint-nft-button">
        Login Blur
      </button>
    );
  };

  const buyBlurNFTButton = () => {
    return (
      <button
        onClick={buyBlurNFTHandler}
        className="cta-button mint-nft-button"
      >
        Buy One NFT
      </button>
    );
  };

  return (
    <center>
      <div>
        <h2>Blur</h2>
        <div>
          <p></p>
          {loginBlurButton()}
          <p></p>
        </div>

        <div className="bordered-div">
          <h4>Buy One NFT</h4>
          <div className="container">
            <div className="input-container">
              <label className="label" htmlFor="contract">
                contract:
              </label>
              <textarea
                className="textarea"
                id="contract"
                placeholder="0x11400ee484355c7bdf804702bf3367ebc7667e54"
              ></textarea>
            </div>

            <div className="input-container">
              <label className="label" htmlFor="tokenId">
                tokenId:
              </label>
              <textarea
                className="textarea"
                id="tokenId"
                placeholder="1053"
              ></textarea>
            </div>
          </div>
          <p></p>
          {blurAccessToken ? buyBlurNFTButton() : PleaseLogin()}
        </div>

        <div className="bordered-div">
          <h4>Buy Multiple NFT</h4>
          <div className="container">
            <div className="input-container">
              <label className="label" htmlFor="contract">
                contracts:
              </label>
              <textarea
                className="textarea"
                id="contracts"
                placeholder="[0xEAAfcC17f28Afe5CdA5b3F76770eFb7ef162D20b,0xEAAfcC17f28Afe5CdA5b3F76770eFb7ef162D20b]"
                style={{ height: "100px", width: "400px" }}
              ></textarea>
            </div>

            <div className="input-container">
              <label className="label" htmlFor="tokenId">
                tokenIds:
              </label>
              <textarea
                className="textarea"
                id="tokenIds"
                placeholder="[100,101]"
                style={{ height: "100px", width: "400px" }}
              ></textarea>
            </div>
          </div>
          {/* <p></p>
          {currentAccount ? fulfillOrdersButton(0) : PleaseLogin()}
          <p></p>
          {currentAccount ? fulfillOrdersButton(1) : PleaseLogin()} */}
        </div>
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

export default BuyBlurNFTPage;
