import { useEffect, useState } from "react";
import DataTable from "../utils/table/DataTable.js";
import {
  getSystemData,
  getENSOfAddress,
  getAddressOfENS,
  getENSOfAddressTheGraph,
  getAddressOfENSTheGraph,
  getNameByTokenIdTheGraph,
  getENSOfAddressByContract,
  getENSUniversalResolver,
  getENSByTokenId,
  getPriceBaseUSDT
} from "../api/GetData.js";
import { isAddress } from "../utils/Utils.js";
import { logDOM } from "@testing-library/react";
import { BigNumber } from "ethers";

const ENSPage = () => {
  const [tableData, setTableData] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [messageENS, setMessageENS] = useState("");
  const [messageAddress, setMessageAddress] = useState("");
  const [messageName, setMessageName] = useState("");
  const [ethPrice, setEthPrice] = useState("");
  const [bnbPrice, setBnbPrice] = useState("");

  useEffect(() => {
    setIsMounted(true);

    // Set up the interval to update the prices every 5 seconds
    const intervalId = setInterval(updatePrices, 5000);

    return () => {
      clearInterval(intervalId);
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      configData();
      updatePrices();
    }
  }, [isMounted]);

  const updatePrices = async () => {
    try {
      let result = await getPriceBaseUSDT();
      if (result.code == 200) {
        let data = result.data;
        setEthPrice(data.ethPrice);
        setBnbPrice(data.bnbPrice);
      }
    } catch (error) {}
  };
  const configData = async () => {
    try {
      let account = localStorage.getItem("userAddress");
      if (account != null) {
        setCurrentAccount(account);
      }
      const data = await getSystemData();
      setTableData(data);
    } catch (error) {}
  };

  const PleaseLogin = () => {
    return <h2>UnLogin, Please Login</h2>;
  };
  const getENSHandler = async () => {
    const addressInput = document.getElementById("addressString");
    const addressValue = addressInput.value;
    let res;
    if (addressInput.length == 44) {
      res = isAddress(JSON.parse(addressValue));
    } else {
      res = isAddress(addressValue);
    }
    if (!res) {
      alert("地址错误");
      return;
    }
    let result = await getENSUniversalResolver(addressValue);
    console.log(result);

    if (result.code != 200) {
      alert(result.message);
      return;
    }
    if (result.data == null) {
      setMessageENS("null");
    } else {
      setMessageENS(result.data);
    }
  };

  const getAddressHandler = async () => {
    const ensInput = document.getElementById("ensString");
    const ensValue = ensInput.value;
    if (ensValue.length < 4) {
      alert("输入错误");
      return;
    }
    let result = await getAddressOfENSTheGraph(ensValue);
    if (result.code != 200) {
      alert(result.message);
      return;
    }

    if (result.data == null) {
      setMessageAddress("null");
    } else {
      setMessageAddress(result.data);
    }
  };

  const getNameByTokenIdHandler = async () => {
    const tokenIdInput = document.getElementById("enstokenId");
    const tokenIdValue = tokenIdInput.value;
    if (tokenIdValue.length < 64) {
      alert("输入错误");
      return;
    }
    const labelHash = BigNumber.from(tokenIdValue).toHexString();

    // if (labelHash.length != 66 || tokenIdValue.length < 64) {
    //   alert("输入错误");
    //   return;
    // }
    let result = await getENSByTokenId(tokenIdValue);
    if (result.code != 200) {
      alert(result.message);
      return;
    }
    if (result.data == null) {
      setMessageName("null");
    } else {
      setMessageName(result.data);
    }
  };

  const getENSButton = () => {
    return (
      <button onClick={getENSHandler} className="cta-button mint-nft-button">
        get ENS
      </button>
    );
  };

  const getAddressButton = () => {
    return (
      <button
        onClick={getAddressHandler}
        className="cta-button mint-nft-button"
      >
        get Address
      </button>
    );
  };

  const getNameByTokenIdButton = () => {
    return (
      <button
        onClick={getNameByTokenIdHandler}
        className="cta-button mint-nft-button"
      >
        get Name By TokenId
      </button>
    );
  };
  return (
    <center>
      <div>
        <div>
          <h1>ENS Service</h1>
          <div className="bordered-div">
            <div>
              <label>address:</label>
              <textarea
                id="addressString"
                placeholder="0xEAAfcC17f28Afe5CdA5b3F76770eFb7ef162D20b"
                style={{ height: "24px", width: "400px", fontSize: "16px" }}
              />
            </div>
            <p></p>
            <div>
              {currentAccount ? getENSButton() : PleaseLogin()}
              <p></p>
              Result ENS:
              <textarea
                type="text"
                value={messageENS}
                readOnly
                style={{
                  width: "160px",
                  height: "20px",
                  color: "red",
                  fontSize: "16px",
                  textAlign: "center"
                }}
              ></textarea>
            </div>
          </div>
          <p></p>
          <p></p>
          <div className="bordered-div">
            {" "}
            <div>
              <label>ENS: </label>
              <textarea
                id="ensString"
                placeholder="abc.eth"
                style={{ height: "24px", width: "400px", fontSize: "16px" }}
              />
            </div>
            <p></p>
            <div>
              {currentAccount ? getAddressButton() : PleaseLogin()}
              <p></p>
              Result Address:
              <textarea
                type="text"
                value={messageAddress}
                readOnly
                style={{
                  width: "400px",
                  height: "24px",
                  color: "red",
                  fontSize: "16px",
                  textAlign: "center"
                }}
              ></textarea>
              <p></p>
            </div>
          </div>
          <p></p>
          <p></p>
          <div className="bordered-div">
            <div>
              <label>ENS TokenId: </label>
              <textarea
                id="enstokenId"
                placeholder="79233663829379634837589865448569342784712482819484549289560981379859480642508"
                style={{ height: "24px", width: "660px", fontSize: "16px" }}
              />
            </div>
            <p></p>
            <div>
              {currentAccount ? getNameByTokenIdButton() : PleaseLogin()}
              <p></p>
              Result Name:
              <textarea
                type="text"
                value={messageName}
                readOnly
                style={{
                  width: "400px",
                  height: "24px",
                  color: "red",
                  fontSize: "16px",
                  textAlign: "center"
                }}
              ></textarea>
              <p></p>
            </div>
          </div>
          <p></p>
          <p></p>
        </div>
      </div>
    </center>
  );
};

export default ENSPage;
