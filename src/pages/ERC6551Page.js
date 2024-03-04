import { useEffect, useState } from "react";
import { isAddress, isContract, stringToArray } from "../utils/Utils.js";

import {
  getSigner,
  getSignerAndAccountAndChainId,
  getSignerAndChainId,
} from "../utils/GetProvider.js";

import { TokenboundClient } from "@tokenbound/sdk";

let url_iframe = "https://iframe-tokenbound.vercel.app";

const ERC6551Page = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [tbAccount, setTbAccount] = useState(null);
  const [created, setCreated] = useState(null);
  const [srcIframe, setSrcIframe] = useState(null);

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

  const getTokenboundClient = async (signer, chainId) => {
    const tokenboundClient = new TokenboundClient({ signer, chainId });

    return tokenboundClient;
  };

  const updateData = async () => {
    let account = localStorage.getItem("userAddress");
    if (account != null) {
      setCurrentAccount(account);
    }
  };

  const configData = async () => {
    let account = localStorage.getItem("userAddress");
    if (account != null) {
      setCurrentAccount(account);
    }
  };

  const PleaseLogin = () => {
    return (
      <button className="cta-button unlogin-nft-button">
        Please Login DApp
      </button>
    );
  };

  const getTBAHandler = async () => {
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
      const [signer, chainId] = await getSignerAndChainId();

      const tokenboundClient = await getTokenboundClient(signer, chainId);
      console.log(tokenboundClient);

      const account = tokenboundClient.getAccount({
        tokenContract: contract,
        tokenId: tokenId,
      });

      setTbAccount(account);
      const is = await isContract(signer.provider, account);
      setCreated(String(is));
      if (is) {
        // https://iframe-tokenbound.vercel.app/0x709B78B36b7208f668A3823c1d1992C0805E4f4d/10/11155111
        url_iframe =
          url_iframe + "/" + contract + "/" + tokenId + "/" + chainId;

        setSrcIframe(url_iframe);
      } else {
        setSrcIframe(null);
      }

      // const data = await tokenboundClient.prepareCreateAccount({
      //   tokenContract: contract,
      //   tokenId: tokenId,
      // });

      // console.log(data);

      // const tx = await tokenboundClient.signer.sendTransaction(data);
      // console.log(tx);

      // if (tx.hash != null) {
      //   setMessage(tx.hash);
      //   let rsult = await tx.wait();
      //   if (rsult.status === 1) {
      //     console.log("Success!");
      //   } else {
      //     console.log("Failure!");
      //   }
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const getTBAButton = () => {
    return (
      <button onClick={getTBAHandler} className="cta-button mint-nft-button">
        get TBA
      </button>
    );
  };

  return (
    <center>
      <div>
        <h2>ERC6551</h2>
        <h3>
          <a
            href="https://docs.tokenbound.org/contracts/deployments"
            target="_blank"
          >
            tokenbound v0.3.1
          </a>
        </h3>

        <div className="bordered-div">
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
          {currentAccount ? getTBAButton() : PleaseLogin()}

          <div className="container">TB Account: {tbAccount}</div>
          <div className="container">Created: {created}</div>
        </div>

        <div>
          {srcIframe != null && (
            <iframe
              style={{ width: "600px", height: "600px" }}
              src={srcIframe}
            ></iframe>
          )}
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

export default ERC6551Page;
