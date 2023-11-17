import { useEffect, useState } from "react";
import { mintNFT, signEIP712MessageMintNft } from "../utils/CallnftMint.js";

const MintNFTPage = () => {
  //   const [tableData, setTableData] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState("1");
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);

  const handleChangeAmount = (event) => {
    setSelectedAmount(event.target.value);
  };

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
    setCurrentAccount(account);
  };
  const mintNftHandler = async () => {
    try {
      console.log("mint amount: " + selectedAmount);
      let [message_, tx] = await mintNFT(selectedAmount);
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
  // signEIP712Message MintNftHandler
  const signEIP712MessageMintNftHandler = async () => {
    try {
      console.log("mint amount: " + selectedAmount);
      let [message_, tx] = await signEIP712MessageMintNft(selectedAmount);
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
  const mintNftButton = (type) => {
    if (type === 1) {
      return (
        <button onClick={mintNftHandler} className="cta-button mint-nft-button">
          Mint NFT
        </button>
      );
    }

    if (type === 2) {
      return (
        <button
          onClick={signEIP712MessageMintNftHandler}
          className="cta-button mint-nft-button"
        >
          signEIP712 Message and Mint NFT
        </button>
      );
    }
  };

  const PleaseLogin = () => {
    return <h2>UnLogin, Please Login</h2>;
  };

  return (
    <center>
      <div>
        <h2>Mint NFT</h2>
        <div>
          <label htmlFor="mintAmount">Mint amount: </label>
          <select
            id="mintAmount"
            style={{ width: "80px", height: "30px", fontSize: "12px" }}
            value={selectedAmount} // 设置当前选中的值
            onChange={handleChangeAmount} // 添加事件处理函数
          >
            <option value="1" style={{ textAlign: "center" }}>
              1
            </option>
            <option value="5" style={{ textAlign: "center" }}>
              5
            </option>
            <option value="10" style={{ textAlign: "center" }}>
              10
            </option>
          </select>
        </div>
        <p></p>
        {currentAccount ? mintNftButton(1) : PleaseLogin()}
        <p></p>
        {currentAccount ? mintNftButton(2) : PleaseLogin()}
      </div>
      <div>
        <h2>
          Please See:
          <p></p>
          <a href={message} target="_blank" rel="noopener noreferrer">
            {message}
          </a>
        </h2>
      </div>
    </center>
  );
};

export default MintNFTPage;
