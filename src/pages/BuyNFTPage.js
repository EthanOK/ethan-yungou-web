import { useEffect, useState } from "react";
import { isAddress, stringToArray } from "../utils/Utils.js";
import { getOrderHashSignatureOpenSea } from "../api/GetData.js";
import {
  fulfillBasicOrder,
  fulfillOrder,
  fulfillBasicOrder_efficient,
  fulfillAvailableAdvancedOrders,
  fulfillAvailableOrders
} from "../utils/OpenseaFunc.js";

const BuyNFTPage = () => {
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
  // TODO:fulfillBasicOrderHandler
  const fulfillBasicOrderHandler = async () => {
    try {
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
      let [message_, tx] = await fulfillBasicOrder(
        contractValue,
        tokenIdValue,
        currentAccount
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
      alert(error);
    }
  };

  // TODO:fulfillOrderHandler
  const fulfillOrderHandler = async () => {
    try {
      const contractInput = document.getElementById("contract");
      const contractValue = contractInput.value;
      const tokenIdInput = document.getElementById("tokenId");
      const tokenIdValue = tokenIdInput.value;
      let [message_, tx] = await fulfillOrder(
        contractValue,
        tokenIdValue,
        currentAccount
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
  // TODO:fulfillBasicOrder_efficientHandler
  const fulfillBasicOrder_efficientHandler = async () => {
    try {
      const contractInput = document.getElementById("contract");
      const contractValue = contractInput.value;
      const tokenIdInput = document.getElementById("tokenId");
      const tokenIdValue = tokenIdInput.value;
      let [message_, tx] = await fulfillBasicOrder_efficient(
        contractValue,
        tokenIdValue,
        currentAccount
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
  // TODO:fulfillAvailableOrdersHandler
  const fulfillAvailableOrdersHandler = async () => {
    try {
      const contractsInput = document.getElementById("contracts");
      let contractsValue = contractsInput.value;
      const tokenIdsInput = document.getElementById("tokenIds");
      let tokenIdsValue = tokenIdsInput.value;
      contractsValue = stringToArray(contractsValue);
      tokenIdsValue = stringToArray(tokenIdsValue);
      let [message_, tx] = await fulfillAvailableOrders(
        contractsValue,
        tokenIdsValue,
        currentAccount
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
  // TODO:fulfillAvailableAdvancedOrdersHandler
  const fulfillAvailableAdvancedOrdersHandler = async () => {
    try {
      const contractsInput = document.getElementById("contracts");
      let contractsValue = contractsInput.value;
      const tokenIdsInput = document.getElementById("tokenIds");
      let tokenIdsValue = tokenIdsInput.value;
      contractsValue = stringToArray(contractsValue);
      tokenIdsValue = stringToArray(tokenIdsValue);
      let [message_, tx] = await fulfillAvailableAdvancedOrders(
        contractsValue,
        tokenIdsValue,
        currentAccount
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

  const fulfillOrderButton = (type) => {
    if (type === 0) {
      return (
        <button
          onClick={fulfillBasicOrderHandler}
          className="cta-button mint-nft-button"
        >
          fulfillBasicOrder(推荐使用)
        </button>
      );
    }
    if (type === 1) {
      return (
        <button
          onClick={fulfillOrderHandler}
          className="cta-button mint-nft-button"
        >
          fulfillOrder
        </button>
      );
    }
    if (type === 2) {
      return (
        <button
          onClick={fulfillBasicOrder_efficientHandler}
          className="cta-button mint-nft-button"
        >
          fulfillBasicOrder_efficient_6GL6yc(gas最优)
        </button>
      );
    }
  };

  const fulfillOrdersButton = (type) => {
    if (type === 0) {
      return (
        <button
          onClick={fulfillAvailableOrdersHandler}
          className="cta-button mint-nft-button"
        >
          fulfillAvailableOrders
        </button>
      );
    }
    if (type === 1) {
      return (
        <button
          onClick={fulfillAvailableAdvancedOrdersHandler}
          className="cta-button mint-nft-button"
        >
          fulfillAvailableAdvancedOrders(推荐使用)
        </button>
      );
    }
  };
  return (
    <center>
      <div>
        <h2>OpenSea</h2>

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
          {currentAccount ? fulfillOrderButton(0) : PleaseLogin()}
          <p></p>
          {currentAccount ? fulfillOrderButton(1) : PleaseLogin()}
          <p></p>
          {currentAccount ? fulfillOrderButton(2) : PleaseLogin()}
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
          <p></p>
          {currentAccount ? fulfillOrdersButton(0) : PleaseLogin()}
          <p></p>
          {currentAccount ? fulfillOrdersButton(1) : PleaseLogin()}
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

export default BuyNFTPage;
