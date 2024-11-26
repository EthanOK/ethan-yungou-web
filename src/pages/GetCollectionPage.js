import { useEffect, useState } from "react";
import { isAddress } from "../utils/Utils.js";

import { getSignerAndChainId } from "../utils/GetProvider.js";

import {
  getContractsForOwner,
  getNFTListByOwnerAndContract
} from "../utils/GetNFTListByOwner.js";

const GetCollectionPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);

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

  const getCollectionHandler = async () => {
    const owner = document.getElementById("owner").value;

    if (!isAddress(owner)) {
      alert("owner is not address");
      return;
    }

    try {
      const [signer, chainId] = await getSignerAndChainId();
      const result = await getContractsForOwner(chainId, owner);
      // const alchemy = getAlchemy(chainId);

      // const result = await alchemy.nft.getContractsForOwner(owner);

      console.log(result);

      if (result != null) {
        setMessage(JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getNFTListHandler = async () => {
    const contract = document.getElementById("contract_2").value;
    const owner = document.getElementById("owner_2").value;
    if (!isAddress(contract) || !isAddress(owner)) {
      alert("contract or owner is not address");
      return;
    }

    try {
      const [signer, chainId] = await getSignerAndChainId();

      const result = await getNFTListByOwnerAndContract(
        chainId,
        owner,
        contract
      );

      if (result != null) {
        setMessage(JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCollectionButton = () => {
    return (
      <button
        onClick={getCollectionHandler}
        className="cta-button mint-nft-button"
      >
        get Collection
      </button>
    );
  };

  const getNFTListButton = () => {
    return (
      <button
        onClick={getNFTListHandler}
        className="cta-button mint-nft-button"
      >
        Get NFTList
      </button>
    );
  };

  return (
    <center>
      <div>
        <h2>GetCollection</h2>

        <div className="bordered-div">
          <div className="container">
            <div className="input-container">
              <label className="label-6" htmlFor="owner">
                owner:
              </label>
              <textarea
                className="textarea"
                id="owner"
                placeholder="0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2"
              ></textarea>
            </div>
          </div>
          <p></p>
          {currentAccount ? getCollectionButton() : PleaseLogin()}
        </div>

        <p></p>
        <p></p>

        <div className="bordered-div">
          <div className="container">
            <div className="input-container">
              <label className="label-6" htmlFor="contract">
                contract:
              </label>
              <textarea
                className="textarea"
                id="contract_2"
                placeholder="0x709b78b36b7208f668a3823c1d1992c0805e4f4d"
              ></textarea>
            </div>

            <div className="input-container">
              <label className="label-6" htmlFor="owner">
                owner:
              </label>
              <textarea
                className="textarea"
                id="owner_2"
                placeholder="0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2"
              ></textarea>
            </div>
          </div>
          <p></p>
          {currentAccount ? getNFTListButton() : PleaseLogin()}
        </div>
        <p></p>
      </div>

      <div>
        <h2>
          Please See:
          <p></p>
          <textarea
            type="text"
            value={message}
            readOnly
            style={{ width: "1200px", height: "400px" }}
          ></textarea>
        </h2>
      </div>
    </center>
  );
};

export default GetCollectionPage;
