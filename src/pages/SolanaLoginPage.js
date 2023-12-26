import { useEffect, useState } from "react";

import base58 from "bs58";

import { PublicKey, clusterApiUrl } from "@solana/web3.js";
import { LOGIN_SOLANA_MESSAGE } from "../utils/SystemConfiguration";
import { signSolanaMessage } from "../utils/SignFunc";
import { getPhantomProvider } from "../utils/GetPhantomProvider";

const SolanaLoginPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentSolanaAccount, setCurrentSolanaAccount] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    const intervalId = setInterval(updateShowData, 2000);

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
    setCurrentSolanaAccount(localStorage.getItem("currentSolanaAccount"));
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
