import { useEffect, useState } from "react";
import * as buffer from "buffer";

// import base58 from "bs58";

import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { LOGIN_SOLANA_MESSAGE } from "../utils/SystemConfiguration";

import { getPhantomProvider } from "../utils/GetPhantomProvider";
import {
  signSolanaMessage,
  verifySolanaSignature,
  verifySolanaSignatureV2,
} from "../utils/SolanaSignAndVerify";
import { getDevConnection } from "../utils/GetSolanaConnection";
import { getSolBalance } from "../utils/SolanaGetBalance";
import { sendTransactionOfPhantom } from "../utils/PhantomSendTransaction";
import { getAssociatedAddress, stringToArray } from "../utils/Utils";
import base58 from "bs58";

const SolanaLoginPage = () => {
  window.Buffer = buffer.Buffer;
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentSolanaAccount, setCurrentSolanaAccount] = useState(null);
  const [accountSOLBalance, setAccountSOLBalance] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [associatedAddress, setAssociatedAddress] = useState("");
  const [solPrivateKey, setSolPrivateKey] = useState("");

  useEffect(() => {
    setIsMounted(true);
    const intervalId = setInterval(updateShowData, 3000);

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
    setCurrentAccount("0x");
    let account = localStorage.getItem("userAddress");
    if (account != null) {
      setCurrentAccount(account);
    }
    try {
      const provider = await getPhantomProvider();

      localStorage.setItem(
        "currentSolanaAccount",
        provider.publicKey.toBase58()
      );
    } catch (error) {
      localStorage.setItem("currentSolanaAccount", "");
    }
  };
  const updateShowData = async () => {
    try {
      let accountSolana = localStorage.getItem("currentSolanaAccount");
      setCurrentSolanaAccount(accountSolana);

      if (accountSolana == "" || accountSolana == null) {
        return;
      }

      const connection = getDevConnection();
      const balance = await getSolBalance(connection, accountSolana);

      setAccountSOLBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.log(error);
    }
  };

  const PleaseLogin = () => {
    return (
      <button className="cta-button unlogin-nft-button">PleaseLogin</button>
    );
  };

  const signSolanaMessageHandler = async () => {
    if (!window.solana) {
      alert("Please install Phantom wallet to use this app");
      return;
    }

    const provider = await getPhantomProvider();

    const publicKey = provider.publicKey;

    const account_Address = publicKey.toBase58();

    console.log(
      "Connected to Phantom wallet. Public key:",
      publicKey.toBase58()
    );

    localStorage.setItem("currentSolanaAccount", account_Address);

    console.log(provider);
    const loginTime = new Date().toLocaleString();

    const message =
      LOGIN_SOLANA_MESSAGE +
      "\nAccount: " +
      account_Address +
      "\nLoginTime: " +
      loginTime;

    const signature_string = await signSolanaMessage(provider, message);

    if (signature_string == null) {
      setMessage("");
      alert("User rejected the signature.");
    } else {
      setMessage(signature_string);

      console.log(signature_string.length);

      const verifyR = await verifySolanaSignature(
        signature_string,
        message,
        account_Address
      );

      console.log(verifyR);

      const verifyR2 = await verifySolanaSignatureV2(
        signature_string,
        message,
        account_Address
      );

      console.log(verifyR2);
    }
  };

  const disConnectHandler = async () => {
    if (!window.solana) {
      alert("Please install Phantom wallet to use this app");
      return;
    }

    const provider = await getPhantomProvider();
    await provider.disconnect();

    setMessage("");
    setAccountSOLBalance(0);
  };

  const airDropHandler = async () => {
    if (!window.solana) {
      alert("Please install Phantom wallet to use this app");
      return;
    }
    if (currentSolanaAccount == "" || currentSolanaAccount == null) {
      return;
    }

    const connection = getDevConnection();

    try {
      const signature = await connection.requestAirdrop(
        new PublicKey(currentSolanaAccount),
        2 * LAMPORTS_PER_SOL
      );
      console.log(signature);
      setAlertMessage("AIRDROP Success!");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      setAlertMessage("AIRDROP Failure!");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  };

  const transferSOLHandler = async () => {
    if (!window.solana) {
      alert("Please install Phantom wallet to use this app");
      return;
    }
    if (currentSolanaAccount == "" || currentSolanaAccount == null) {
      return;
    }
    const toSolAddressInput = document.getElementById("toSolAddress");
    const toSolAddressInputValue = toSolAddressInput.value;
    const addressArray = stringToArray(toSolAddressInputValue);
    if (addressArray.length == 0) {
      alert("To address is null");
      return;
    }
    addressArray.forEach((address) => {
      if (address.length != 44) {
        alert("To address is not valid");
        return;
      }
    });

    try {
      const provider = await getPhantomProvider();

      const connection = getDevConnection();
      console.log(provider);
      console.log(provider.publicKey.toString());

      const items = [];
      addressArray.forEach((toAddress) => {
        items.push(
          SystemProgram.transfer({
            fromPubkey: provider.publicKey,
            toPubkey: new PublicKey(toAddress),
            lamports: 0.5 * LAMPORTS_PER_SOL,
          })
        );
      });

      const transaction = new Transaction().add(...items);

      const signature = await sendTransactionOfPhantom(
        connection,
        provider,
        transaction
      );

      console.log(signature);
      if (signature == null) {
        setAlertMessage("send Sol Failure!");
      } else {
        setAlertMessage("send Sol Success!");
      }

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      setAlertMessage("send Sol Failure!");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  };

  const getAssociatedAddressHandler = async () => {
    const ownerAddress = document.getElementById("ownerAddress").value;
    const mintAddress = document.getElementById("mintAddress").value;

    const associatedAddress = await getAssociatedAddress(
      mintAddress,
      ownerAddress
    );

    console.log(associatedAddress);
    setAssociatedAddress(associatedAddress);
  };

  const getSOLPrivatekeyHandler = async () => {
    const keypair = document.getElementById("keypair").value;
    const pair = JSON.parse(keypair);
    const privateKey = base58.encode(pair);
    setSolPrivateKey(privateKey);
  };

  const loginSolanaButton = () => {
    return (
      <button
        onClick={signSolanaMessageHandler}
        className="cta-button mint-nft-button"
      >
        Login Solana
      </button>
    );
  };

  const disConnectButton = () => {
    return (
      <button
        onClick={disConnectHandler}
        className="cta-button mint-nft-button"
      >
        DisConnect
      </button>
    );
  };

  const transferSOLButton = () => {
    return (
      <button
        onClick={transferSOLHandler}
        className="cta-button mint-nft-button"
      >
        Everyone transfer 0.5 SOL
      </button>
    );
  };

  const getAssociatedAddressButton = () => {
    return (
      <button
        onClick={getAssociatedAddressHandler}
        className="cta-button mint-nft-button"
      >
        getAssociatedAddress
      </button>
    );
  };

  const getSOLPrivatekeyButton = () => {
    return (
      <button
        onClick={getSOLPrivatekeyHandler}
        className="cta-button mint-nft-button"
      >
        getSolPrivatekey
      </button>
    );
  };

  const airDropButton = () => {
    return (
      <button onClick={airDropHandler} className="cta-button mint-nft-button">
        AirDrop 2 SOL
      </button>
    );
  };

  return (
    <center>
      <div>
        {showAlert && (
          <div className="alert">
            <h2>{alertMessage}</h2>
          </div>
        )}
        <h2>Login Solana</h2>
        Solana Account: {currentSolanaAccount}
        <p></p>
        Balance(DEV): {accountSOLBalance} SOL
        <p></p>
        <p></p>
        {currentAccount ? loginSolanaButton() : PleaseLogin()}
        <p></p>
        {currentAccount ? airDropButton() : PleaseLogin()}
        <p></p>
        <p></p>
        {currentAccount ? disConnectButton() : PleaseLogin()}
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

      <p></p>

      <div className="bordered-div">
        <h2>Batch Transfer SOL</h2>
        <label className="label">ToAddress:</label>
        <textarea
          className="textarea"
          id="toSolAddress"
          placeholder="[3c5MLawkv9DY4C4zh39xHMic8MCTfBLVEZRSG4cWjjiH,AQAMLqdN3LSvaHx5tCVeWZWDRTGqL7QuvNgojCb3pS6Z]"
          style={{ width: "400px", height: "100px" }}
        ></textarea>

        <p></p>
        {currentSolanaAccount ? transferSOLButton() : PleaseLogin()}
      </div>

      <p></p>
      <div className="bordered-div">
        <h2>Batch Transfer SOL</h2>
        <label className="label">ownerAddress:</label>
        <textarea
          className="textarea"
          id="ownerAddress"
          placeholder="2xuEyZoSkiiNBAgL21XobUCraojPUZ82GHuWpCPgpyXF"
          style={{ width: "450px", height: "16px" }}
        ></textarea>
        <p></p>
        <label className="label">mintAddress:</label>
        <textarea
          className="textarea"
          id="mintAddress"
          placeholder="2xuEyZoSkiiNBAgL21XobUCraojPUZ82GHuWpCPgpyXF"
          style={{ width: "450px", height: "16px" }}
        ></textarea>
        <p></p>
        {getAssociatedAddressButton()}
        <p></p>
        Associated Address: {associatedAddress}
      </div>

      <p></p>
      <div className="bordered-div">
        <h3>Keypair To PrivateKey</h3>
        <div>
          <label className="label">keypair:</label>
          <textarea
            className="multiline-textarea"
            id="keypair"
            placeholder="[38,109,228,83,26,37,10,17,191,88,35,2,57,168,81,242,69,45,39,19,105,131,213,152,160,107,31,59,226,22,114,180,137,182,45,71,20,19,69,96,3,136,126,234,234,23,153,66,217,243,223,192,247,89,16,24,11,17,240,172,138,172,13,244]"
            style={{ height: "70px", width: "500px", fontSize: "14px" }}
          ></textarea>
          <p></p>
          {getSOLPrivatekeyButton()}
          <p></p>
          SOL PrivateKey: {solPrivateKey}
        </div>
      </div>
    </center>
  );
};

export default SolanaLoginPage;
