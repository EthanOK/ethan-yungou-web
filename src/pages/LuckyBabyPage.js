import { useEffect, useState } from "react";
import {
  participate,
  getWinners,
  redeemPrize,
  getNumberParticipants,
  getCurrentIssueIdOpenState,
  openPrizePool,
  incrementNewIssue
} from "../utils/CallLuckyBaby.js";

import { stringToArray } from "../utils/Utils.js";

const LuckyBabyPage = () => {
  //   const [tableData, setTableData] = useState([]);
  const [selectedPayType, setSelectedPayType] = useState("1");
  const [selectedPrizeType, setSelectedPrizeType] = useState("1");
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [redeemMessage, setRedeemMessage] = useState("");
  const [winners, setWinners] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [numberAllTicket, setNumberAllTicket] = useState(null);
  const [numberCurrTicket, setNumberCurrTicket] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentIssueId, setCurrentIssueId] = useState(null);
  const [openState, setOpenState] = useState("");

  const handleChangePayType = (event) => {
    setSelectedPayType(event.target.value);
  };
  const handleChangePrizeType = (event) => {
    setSelectedPrizeType(event.target.value);
  };

  useEffect(() => {
    setIsMounted(true);
    const intervalId = setInterval(updateNumber, 5000);
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

  const configData = async () => {
    try {
      let account = localStorage.getItem("userAddress");
      setCurrentAccount(account);

      let [currentIssueId_, openState_] = await getCurrentIssueIdOpenState();
      setCurrentIssueId(currentIssueId_.toString());
      setOpenState(openState_.toString());

      if (parseInt(currentIssueId_) !== 0) {
        let [currentNumber, allNumber] = await getNumberParticipants();
        setNumberAllTicket(allNumber.toString());
        setNumberCurrTicket(currentNumber.toString());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateNumber = async () => {
    let [currentIssueId_, openState_] = await getCurrentIssueIdOpenState();
    setCurrentIssueId(currentIssueId_.toString());
    setOpenState(openState_.toString());

    if (parseInt(currentIssueId_) !== 0) {
      let [currentNumber, allNumber] = await getNumberParticipants();
      setNumberAllTicket(allNumber.toString());
      setNumberCurrTicket(currentNumber.toString());
    }
  };
  const participateHandler = async () => {
    try {
      const amountInput = document.getElementById("buyAmount");
      const amountValue = amountInput.value;
      if (numberCurrTicket == numberAllTicket) {
        alert("All ticket has been sold");
        return;
      }

      let [message_, tx] = await participate(amountValue);

      if (tx == null) {
        return;
      } else if (message_ != null) {
        setMessage(message_);
        let rsult = await tx.wait();
        if (rsult.status === 1) {
          console.log("Success!");
          setAlertMessage("Participate Successful!");
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        } else {
          console.log("Failure!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getWinnersHandler = async () => {
    try {
      let winners_ = await getWinners();
      // console.log(winners_);
      if (winners_ != null) {
        setWinners(JSON.stringify(winners_, null, "\t"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const redeemPrizeHandler = async () => {
    try {
      let [message_, tx] = await redeemPrize();
      if (tx == null) {
        alert(message_);
        return;
      }
      if (message_ != null) {
        setRedeemMessage(message_);
        let rsult = await tx.wait();
        if (rsult.status === 1) {
          console.log("Success!");
          setAlertMessage("Redeem Successful!");
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        } else {
          console.log("Failure!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openPrizePoolHandler = async () => {
    try {
      let [message_, tx] = await openPrizePool();
      if (tx == null) {
        alert(message_);
        return;
      }
      if (message_ != null) {
        let rsult = await tx.wait();
        if (rsult.status === 1) {
          console.log("Success!");
          setAlertMessage("Open Successful!");
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        } else {
          console.log("Failure!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createNewIssueHandler = async () => {
    try {
      const issuanceTotalInput = document.getElementById("issuanceTotal");
      const issuanceTotalValue = issuanceTotalInput.value;
      const countMaxPerInput = document.getElementById("countMaxPer");
      const countMaxPerValue = countMaxPerInput.value;
      const startTimeInput = document.getElementById("startTime");
      const startTimeValue = startTimeInput.value;
      const endTimeInput = document.getElementById("endTime");
      const endTimeValue = endTimeInput.value;

      const payTokenType = selectedPayType;

      const payTokenAddressInput = document.getElementById("payTokenAddress");
      const payTokenAddressValue = payTokenAddressInput.value;
      const payTokenAmountInput = document.getElementById("payTokenAmount");
      const payTokenAmountValue = payTokenAmountInput.value;

      const prizeType = selectedPrizeType;

      const numberWinnerInput = document.getElementById("numberWinner");
      const numberWinnerValue = numberWinnerInput.value;
      const prizeAddressInput = document.getElementById("prizeAddress");
      const prizeAddressValue = prizeAddressInput.value;
      const prizeAmountsInput = document.getElementById("prizeAmounts");
      const prizeAmountsValue = prizeAmountsInput.value;
      const prizeTokenIdsInput = document.getElementById("prizeTokenIds");
      const prizeTokenIdsValue = prizeTokenIdsInput.value;

      const payToken = {
        payType: payTokenType,
        token: payTokenAddressValue,
        amount: payTokenAmountValue
      };

      const prize = {
        prizeType: prizeType,
        // The number of winners
        numberWinner: numberWinnerValue,
        // Token address
        token: prizeAddressValue,
        // Amount or quantity per winner
        amounts: stringToArray(prizeAmountsValue),
        // If PrizeType = ERC721, NFT tokenIds
        tokenIds: stringToArray(prizeTokenIdsValue)
      };

      if (prizeType == 2 && stringToArray(prizeTokenIdsValue).length == 0) {
        alert("Please input NFT tokenIds!");
        return;
      }

      let [message_, tx] = await incrementNewIssue(
        issuanceTotalValue,
        countMaxPerValue,
        startTimeValue,
        endTimeValue,
        payToken,
        prize
      );
      if (tx == null) {
        alert(message_);
        return;
      }
      if (message_ != null) {
        let rsult = await tx.wait();
        if (rsult.status === 1) {
          console.log("Success!");
          setAlertMessage("Insert Successful!");
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        } else {
          console.log("Failure!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const participateButton = () => {
    return (
      <button
        onClick={participateHandler}
        className="cta-button mint-nft-button"
      >
        Participate Activity
      </button>
    );
  };

  const getWinnersButton = () => {
    return (
      <button
        onClick={getWinnersHandler}
        className="cta-button mint-nft-button"
      >
        get Winners
      </button>
    );
  };

  const redeemPrizeButton = () => {
    return (
      <button
        onClick={redeemPrizeHandler}
        className="cta-button mint-nft-button"
      >
        redeem Prize
      </button>
    );
  };

  const createNewIssueButton = () => {
    return (
      <button
        onClick={createNewIssueHandler}
        style={{
          backgroundColor: "red",
          border: "none",
          padding: "10px",
          borderRadius: "10px"
        }}
      >
        Create New Issue
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
          <h1>{alertMessage}</h1>
        </div>
      )}
      <h1>Please Switch To Goerli</h1>
      <div className="bordered-div">
        <h2>Lucky Baby</h2>
        <h2>Current Issue: {currentIssueId}</h2>
        <h2>Open State: {openState}</h2>
        <p>
          <button
            onClick={openPrizePoolHandler}
            style={{
              backgroundColor: "red",
              border: "none",
              padding: "10px",
              borderRadius: "10px"
            }}
          >
            Open PrizePool
          </button>
        </p>
        <h2>
          Sold/All: {numberCurrTicket}/{numberAllTicket}
        </h2>
      </div>
      <p></p>

      <div className="bordered-div">
        {" "}
        <div>
          <div>
            <label>amount: </label>
            <textarea
              id="buyAmount"
              placeholder="1"
              style={{ height: "24px", width: "400px", fontSize: "16px" }}
            />
          </div>
          <p></p>
          {currentAccount ? participateButton() : PleaseLogin()}
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
      </div>
      <p></p>
      <div className="bordered-div">
        <p></p>
        {currentAccount ? getWinnersButton() : PleaseLogin()}
        <p></p>
        <textarea
          type="text"
          value={winners}
          readOnly
          style={{ width: "400px", height: "100px" }}
        ></textarea>
      </div>

      <p></p>
      <div className="bordered-div">
        <p></p>
        {currentAccount ? redeemPrizeButton() : PleaseLogin()}
        <p></p>
        <h2>
          Please See:
          <p></p>
          <a href={redeemMessage} target="_blank" rel="noopener noreferrer">
            {redeemMessage}
          </a>
        </h2>
      </div>
      <p></p>
      <div className="bordered-div">
        <div>
          <label>总发行量: </label>
          <textarea
            id="issuanceTotal"
            placeholder="1000"
            style={{ height: "24px", width: "400px", fontSize: "16px" }}
          />
        </div>{" "}
        <div>
          <label>每人最多购买量: </label>
          <textarea
            id="countMaxPer"
            placeholder="1"
            style={{ height: "24px", width: "350px", fontSize: "16px" }}
          />
        </div>
        <div>
          <label>startTime: </label>
          <textarea
            id="startTime"
            placeholder="1692154800"
            style={{ height: "24px", width: "400px", fontSize: "16px" }}
          />
        </div>
        <div>
          <label>endTime: </label>
          <textarea
            id="endTime"
            placeholder="2692154800"
            style={{ height: "24px", width: "400px", fontSize: "16px" }}
          />
        </div>
        <div>
          <label>payToken_Type: </label>
          <select
            id="payTokenType"
            style={{ width: "360px", height: "28px", fontSize: "12px" }}
            value={selectedPayType} // 设置当前选中的值
            onChange={handleChangePayType} // 添加事件处理函数
          >
            <option value="0" style={{ textAlign: "center" }}>
              ETH
            </option>
            <option value="1" style={{ textAlign: "center" }}>
              ERC20
            </option>
          </select>
        </div>
        <div>
          <label>payToken_Addr: </label>
          <textarea
            id="payTokenAddress"
            placeholder="0xd042eF5cF97c902bF8F53244F4a81ec4f8E465Ab"
            style={{ height: "24px", width: "350px", fontSize: "16px" }}
          />
        </div>
        <div>
          <label>payToken_Amount: </label>
          <textarea
            id="payTokenAmount"
            placeholder="1000000000000000000"
            style={{ height: "24px", width: "330px", fontSize: "16px" }}
          />
        </div>
        <div>
          <label>prize_Type: </label>
          <select
            id="prizeType"
            style={{ width: "400px", height: "28px", fontSize: "12px" }}
            value={selectedPrizeType} // 设置当前选中的值
            onChange={handleChangePrizeType} // 添加事件处理函数
          >
            <option value="0" style={{ textAlign: "center" }}>
              ETH
            </option>
            <option value="1" style={{ textAlign: "center" }}>
              ERC20
            </option>
            <option value="2" style={{ textAlign: "center" }}>
              ERC721
            </option>
          </select>
        </div>
        <div>
          <label>中奖人数: </label>
          <textarea
            id="numberWinner"
            placeholder="2"
            style={{ height: "24px", width: "400px", fontSize: "16px" }}
          />
        </div>
        <div>
          <label>prize_Addr: </label>
          <textarea
            id="prizeAddress"
            placeholder="0xd042eF5cF97c902bF8F53244F4a81ec4f8E465Ab"
            style={{ height: "24px", width: "390px", fontSize: "16px" }}
          />
        </div>
        <div>
          <label>prize_Amounts: </label>
          <textarea
            id="prizeAmounts"
            placeholder="[2,1]"
            style={{ height: "24px", width: "360px", fontSize: "16px" }}
          />
        </div>
        <div>
          <label>prize_TokenIds: </label>
          <textarea
            id="prizeTokenIds"
            placeholder="[2,3,4]"
            style={{ height: "24px", width: "360px", fontSize: "16px" }}
          />
        </div>
        <p style={{ fontSize: "14px", color: "red" }}>
          {" "}
          注：prize_Amounts数组的长度为中奖人数；若 prize_Type = ERC721,
          prize_Amounts数组元素累加总和为 prize_TokenIds 数组长度
        </p>
        {currentAccount ? createNewIssueButton() : PleaseLogin()}
        <p></p>
        <h2>
          Please See:
          <p></p>
          <a href={redeemMessage} target="_blank" rel="noopener noreferrer">
            {redeemMessage}
          </a>
        </h2>
      </div>
      <p></p>
    </center>
  );
};

export default LuckyBabyPage;
