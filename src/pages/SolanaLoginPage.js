import { useEffect, useState } from "react";

import base58 from "bs58";

import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
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

const SolanaLoginPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentSolanaAccount, setCurrentSolanaAccount] = useState(null);
  const [accountSOLBalance, setAccountSOLBalance] = useState(null);

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

      const connnection = getDevConnection();
      const balance = await getSolBalance(connnection, accountSolana);

      setAccountSOLBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.log(error);
    }
  };

  const PleaseLogin = () => {
    return <h2>UnLogin, Please Login</h2>;
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
        disConnect
      </button>
    );
  };

  return (
    <center>
      <div>
        <h2>Login Solana</h2>
        Solana Account: {currentSolanaAccount}
        <p></p>
        Balance(DEV): {accountSOLBalance} SOL
        <p></p>
        <p></p>
        {currentAccount ? loginSolanaButton() : PleaseLogin()}
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
    </center>
  );
};

export default SolanaLoginPage;
