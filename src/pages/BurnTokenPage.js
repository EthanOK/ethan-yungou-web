import { useEffect, useState } from "react";
import { getFaucetContract, getERC20Contract } from "../utils/GetContract.js";

import { getDecimal, getDecimalBigNumber, isAddress } from "../utils/Utils.js";
import { BigNumber } from "ethers";
const BurnTokenPage = () => {
  //   const [tableData, setTableData] = useState([]);

  const [isMounted, setIsMounted] = useState(false);
  const [tokenAddress, setTokenAddress] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // const intervalId = setInterval(updateBalance, 5000);
    return () => {
      // clearInterval(intervalId);
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
    setCurrentAccount(account);
  };

  const burnTokenHandler = async () => {
    try {
      if (tokenAddress == null) return;
      let erc20contract = await getERC20Contract(tokenAddress);
      const burnAccount = "0x0000000000000000000000000000000000000001";
      let tx = await erc20contract.transfer(
        burnAccount,
        BigNumber.from(tokenBalance)
      );

      let result = await tx.wait();
      if (result.status === 1) {
        console.log("Success!");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);

        await getBalanceHandler();
      } else {
        console.log("Failure!");
      }
    } catch (error) {}
  };

  const getBalanceHandler = async () => {
    let account = localStorage.getItem("userAddress");

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

    let erc20contract = await getERC20Contract(addressValue);

    let tokenBalance = await erc20contract.balanceOf(account);
    setTokenAddress(addressValue);
    setTokenBalance(tokenBalance);
  };

  const burnTokenButton = () => {
    return (
      <button onClick={burnTokenHandler} className="cta-button mint-nft-button">
        Burn Token
      </button>
    );
  };
  const importButton = () => {
    return (
      <button
        onClick={getBalanceHandler}
        className="cta-button mint-nft-button"
      >
        Import
      </button>
    );
  };

  const PleaseLogin = () => {
    return <h2>UnLogin, Please Login</h2>;
  };

  return (
    <center>
      {showAlert && (
        <div className="alert">
          <h1>Claim Successful!</h1>
        </div>
      )}{" "}
      <h1>Please Switch To Goerli OR TBSC</h1>
      <h2>Burn Token</h2>
      <div className="bordered-div">
        <div>
          <label>ERC20 Token:&nbsp;</label>
          <textarea
            id="addressString"
            placeholder="0xEAAfcC17f28Afe5CdA5b3F76770eFb7ef162D20b"
            style={{ height: "24px", width: "400px", fontSize: "16px" }}
          />
        </div>
        <p></p>

        {currentAccount ? importButton() : PleaseLogin()}

        <p></p>
        <div>
          <label>balance: &nbsp;</label>
          <textarea
            // type="text"
            value={tokenBalance}
            // readOnly
            style={{
              width: "400px",
              height: "20px",
              color: "red",
              fontSize: "16px",
              textAlign: "center"
            }}
          />
          <p></p>
        </div>

        {currentAccount ? burnTokenButton() : PleaseLogin()}
      </div>
      <p></p>
    </center>
  );
};

export default BurnTokenPage;
