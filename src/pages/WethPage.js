import { useEffect, useState } from "react";
import * as buffer from "buffer";

// import base58 from "bs58";

import {
  Keypair,
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
import {
  getMetadataPDA,
  getWethMintAddress,
  getWethProgram,
} from "../utils/GetWethProgram";

const WethPage = () => {
  window.Buffer = buffer.Buffer;
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentSolanaAccount, setCurrentSolanaAccount] = useState(null);
  const [accountSOLBalance, setAccountSOLBalance] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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

  const initializeHandler = async () => {
    if (!window.solana) {
      alert("Please install Phantom wallet to use this app");
      return;
    }
    const connection = getDevConnection();
    const provider = await getPhantomProvider();
    const program = getWethProgram(connection, provider);

    const weth_mint = PublicKey.findProgramAddressSync(
      [Buffer.from("weth_mint")],
      program.programId
    )[0];

    const weth_mint_metadata = getMetadataPDA(weth_mint);

    let state;

    try {
      const accountinfo = await connection.getAccountInfo(weth_mint);
      console.log(accountinfo);

      state = true;
    } catch (error) {
      state = false;
    }

    if (state) {
      console.log("already initialized");
    } else {
      const tx = await program.methods
        .initialize()
        .accountsPartial({
          signer: provider.publicKey,
          wethMetadata: weth_mint_metadata,
        })
        // .signers([owner])
        .rpc();
      console.log(tx);
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

  const initializeButton = () => {
    return (
      <button
        onClick={initializeHandler}
        className="cta-button mint-nft-button"
      >
        initialize
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

  return (
    <center>
      <div className="bordered-div">
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
            style={{ width: "600px", height: "60px" }}
          ></textarea>
        </h2>
      </div>
      <h2>Weth</h2>
      <p>address: {getWethMintAddress()}</p>
      <div className="bordered-div">
        <h3>Initialize</h3>
        <p></p>
        {currentSolanaAccount ? initializeButton() : PleaseLogin()}
      </div>
    </center>
  );
};

export default WethPage;
