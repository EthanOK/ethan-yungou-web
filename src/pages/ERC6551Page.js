import { useEffect, useState } from "react";
import {
  getScanURL,
  isAddress,
  isContract,
  stringToArray
} from "../utils/Utils.js";

import {
  getSigner,
  getSignerAndAccountAndChainId,
  getSignerAndChainId
} from "../utils/GetProvider.js";

import { TBVersion, TokenboundClient } from "@tokenbound/sdk";
import { Contract } from "ethers";

let url_iframe = "https://iframe-tokenbound.vercel.app";

const ERC6551Page = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [tbAccount, setTbAccount] = useState(null);
  const [created, setCreated] = useState(null);
  const [srcIframe, setSrcIframe] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [hashURL, setHashURL] = useState("");

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

  const getTokenboundClient = async (signer, chainId, isV2) => {
    const tokenboundClient = new TokenboundClient({
      signer,
      chainId,
      version: isV2 ? TBVersion.V2 : TBVersion.V3
    });

    return tokenboundClient;
  };

  const ERC6551_Is_V3 = async (signer, account) => {
    const abi = [
      "function supportsInterface(bytes4 interfaceId) external view returns (bool)"
    ];

    const erc6551 = new Contract(account, abi, signer);
    // v3: 0x6faff5f1
    const isV3 = await erc6551.supportsInterface("0x6faff5f1");
    return isV3;
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
        tokenId: tokenId
      });

      setTbAccount(account);
      const isCreate = await tokenboundClient.checkAccountDeployment({
        accountAddress: account
      });
      setCreated(String(isCreate));

      if (isCreate) {
        console.log(
          "ERC6551Account Version v3: ",
          await ERC6551_Is_V3(signer, account)
        );

        const iframe =
          url_iframe + "/" + contract + "/" + tokenId + "/" + chainId;

        setSrcIframe(iframe);
      } else {
        setSrcIframe(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createHandler = async () => {
    const contract = document.getElementById("contract_create").value;
    const tokenId = document.getElementById("tokenId_create").value;
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
        tokenId: tokenId
      });

      setTbAccount(account);
      const isCreate = await tokenboundClient.checkAccountDeployment({
        accountAddress: account
      });

      setCreated(String(isCreate));

      if (isCreate) {
        alert("Account is already created");
        const iframe =
          url_iframe + "/" + contract + "/" + tokenId + "/" + chainId;

        setSrcIframe(iframe);
        return;
      } else {
        setSrcIframe(null);
      }

      const multiCallTx_data = await tokenboundClient.prepareCreateAccount({
        tokenContract: contract,
        tokenId: tokenId
      });

      const tx =
        await tokenboundClient.signer.sendTransaction(multiCallTx_data);
      console.log(tx);

      if (tx.hash != null) {
        setTxHash(tx.hash);
        let etherscanURL = await getScanURL();
        let message = `${etherscanURL}/tx/${tx.hash}`;
        setHashURL(message);
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

  const getTBAButton = () => {
    return (
      <button onClick={getTBAHandler} className="cta-button mint-nft-button">
        get TBA
      </button>
    );
  };

  const createTBAButton = () => {
    return (
      <button onClick={createHandler} className="cta-button mint-nft-button">
        Create TBA
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

        <p></p>
        <p></p>

        <div className="bordered-div">
          <div className="container">
            <div className="input-container">
              <label className="label" htmlFor="contract">
                contract:
              </label>
              <textarea
                className="textarea"
                id="contract_create"
                placeholder="0x11400ee484355c7bdf804702bf3367ebc7667e54"
              ></textarea>
            </div>

            <div className="input-container">
              <label className="label" htmlFor="tokenId">
                tokenId:
              </label>
              <textarea
                className="textarea"
                id="tokenId_create"
                placeholder="1053"
              ></textarea>
            </div>
          </div>
          <p></p>
          {currentAccount ? createTBAButton() : PleaseLogin()}

          <div className="container">TB Account: {tbAccount}</div>
          <div className="container">Created: {created}</div>
          {txHash && (
            <div className="container" style={{ display: "inline" }}>
              TxHash:{" "}
              <a href={hashURL} target="_blank" rel="noopener noreferrer">
                {txHash}
              </a>
            </div>
          )}
        </div>
        <p></p>
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
