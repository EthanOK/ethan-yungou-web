import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { ethers } from "ethers";

const clientId =
  "BGaYve_5NaFEkrmlHuvoCcTA9Lj0DJV2JoOOyJyGA2Ch3q6KjPV7olKu1CU03zOmTJ0eLrr0ErEvZbGRlXs6Ju4"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainNamespace: "eip155",
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

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig: chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider: privateKeyProvider,
});

const Web3AuthPage = () => {
  const [provider, setProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // IMP START - SDK Initialization
        await web3auth.initModal();
        // IMP END - SDK Initialization
        setProvider(web3auth.provider);

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

    console.log(web3authProvider);

    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const unloggedInView = (
    <button onClick={loginHandler} className="card">
      Login
    </button>
  );

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

    const signer = await getSigner();

    const address = await signer.getAddress();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const signer = await getSigner();

    // Get user's Ethereum public address
    const address = await signer.getAddress();

    // Get user's balance in ether
    const balance = ethers.utils.formatEther(
      await signer.provider.getBalance(address)
    );
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const signer = await getSigner();

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await signer.signMessage(originalMessage);
    uiConsole(signedMessage);
  };
  // IMP END - Blockchain Calls

  const getPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const privateKey = await provider.request({
      method: "eth_private_key",
    });
    uiConsole(privateKey);
  };

  function uiConsole(...args) {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
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
            Web3Auth
          </a>
        </h2>

        <div className="bordered-div">
          <div className="container">
            <p></p>
            <div className="grid">
              {loggedIn ? loggedInView : unloggedInView}
            </div>
          </div>

          <p></p>
          <p></p>
        </div>
      </div>
    </center>
  );
};

export default Web3AuthPage;
