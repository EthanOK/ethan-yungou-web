import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import {
  SolanaPrivateKeyProvider,
  SolanaWallet,
} from "@web3auth/solana-provider";
import { ethers } from "ethers";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

const clientId =
  "BGaYve_5NaFEkrmlHuvoCcTA9Lj0DJV2JoOOyJyGA2Ch3q6KjPV7olKu1CU03zOmTJ0eLrr0ErEvZbGRlXs6Ju4"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const chainConfig_solana = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: "0x3", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
  rpcTarget: "https://api.devnet.solana.com",
  displayName: "Solana Testnet",
  blockExplorerUrl: "https://explorer.solana.com",
  ticker: "SOL",
  tickerName: "Solana",
  logo: "https://images.toruswallet.io/solana.svg",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig: chainConfig },
});
const privateKeyProvider_solana = new SolanaPrivateKeyProvider({
  config: { chainConfig: chainConfig_solana },
});

// const web3auth = new Web3Auth({
//   clientId,
//   web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
//   privateKeyProvider: privateKeyProvider,
// });

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider: privateKeyProvider_solana,
});

const Web3AuthSolanaPage = () => {
  const [provider, setProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [solanaWallet, setSolanaWallet] = useState(null);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // IMP START - SDK Initialization
        await web3auth.initModal();
        // IMP END - SDK Initialization
        setProvider(web3auth.provider);
        const solanaWallet = new SolanaWallet(web3auth.provider);
        setSolanaWallet(solanaWallet);

        const connection = await getConnnection(solanaWallet);
        setConnection(connection);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const loginHandler = async () => {
    // IMP START - Login
    const web3authProvider = await web3auth.connect();
    // IMP END - Login
    setProvider(web3authProvider);
    const solanaWallet = new SolanaWallet(web3auth.provider);
    setSolanaWallet(solanaWallet);
    const connection = await getConnnection(solanaWallet);
    setConnection(connection);
    console.log("solanaWallet", solanaWallet);

    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const unloggedInView = (
    <button onClick={loginHandler} className="card">
      Login
    </button>
  );

  const getConnnection = async (solanaWallet) => {
    const connectionConfig = await solanaWallet.request({
      method: "solana_provider_config",
      params: [],
    });
    const connection = new Connection(connectionConfig.rpcTarget);
    return connection;
  };

  const getUserInfo = async () => {
    // IMP START - Get User Information
    const user = await web3auth.getUserInfo();
    // IMP END - Get User Information
    uiConsole(user);
  };

  const getSigner = async () => {
    // IMP START - Get Signer
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    return ethersProvider.getSigner();
  };

  const logout = async () => {
    // IMP START - Logout
    await web3auth.logout();
    // IMP END - Logout
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };

  // IMP START - Blockchain Calls
  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    // Get user's Ethereum public address
    // const signer = await getSigner();
    // const accounts = await signer.getAddress();

    // Get user's Solana public address
    const accounts = await solanaWallet.requestAccounts();
    uiConsole(accounts);
    return accounts;
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    // const signer = await getSigner();
    // // Get user's Ethereum public address
    // const address = await signer.getAddress();
    // // Get user's balance in ether
    // const balance = ethers.utils.formatEther(
    //   await signer.provider.getBalance(address)
    // );

    const accounts = await getAccounts();
    const balance = await connection.getBalance(new PublicKey(accounts[0]));

    // solana  format balance
    const balance_sol = balance / LAMPORTS_PER_SOL;

    uiConsole(balance_sol + " SOL");
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const originalMessage = "This is Web3Auth";

    // const signer = await getSigner();

    // Sign the message
    // const signedMessage = await signer.signMessage(originalMessage);

    const signedMessage = await solanaWallet.signMessage(
      Buffer.from(originalMessage, "utf8")
    );
    uiConsole(bs58.encode(signedMessage));
  };
  // IMP END - Blockchain Calls

  const getPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    // const privateKey = await provider.request({
    //   method: "eth_private_key",
    // });
    const privateKey = await web3auth.provider.request({
      method: "solanaPrivateKey",
    });

    const buffer = Buffer.from(privateKey, "hex");

    const privateKey_base58 = bs58.encode(buffer);

    uiConsole(privateKey_base58);
  };

  function uiConsole(...args) {
    const el = document.querySelector("#console>p");
    if (Array.isArray(args) && args.length === 1) {
      el.innerHTML = JSON.stringify(args[0], null, 2);
    } else {
      el.innerHTML = JSON.stringify(args, null, 2);
    }

    console.log(...args);
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>

        <div>
          <button onClick={getPrivateKey} className="card">
            Get PrivateKey
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
    </>
  );

  return (
    <center>
      <div>
        <h2>
          <a href="https://web3auth.io/" target="_blank">
            Web3Auth Solana
          </a>
        </h2>

        <div className="bordered-div">
          <div className="container">
            <p></p>
            <div className="grid">
              {loggedIn ? loggedInView : unloggedInView}
            </div>
            <div id="console">
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

export default Web3AuthSolanaPage;
