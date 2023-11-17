import { useEffect, useState } from "react";
import "./App.css";
import contractabi from "./contracts/erc721A.json";
import { ethers, providers, utils } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

// goerli
const contractAddress = "0x71eE06999F6D5f66AcA3c12e45656362fD9D031f";
const abi = contractabi;
const chainIdETH = "0x5";
const mintAmount = 1;
function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [metamask, setMetamask] = useState(null);
  const [walletSigner, setWalletSigner] = useState(null);
  const [web3Provider, setWeb3Provider] = useState(null);
  const [message, setMessage] = useState("");
  const { ethereum } = window;

  window.ethereum.on("chainChanged", handleChainChanged);

  function handleChainChanged(chainId) {
    // We recommend reloading the page, unless you must do otherwise.
    if (parseInt(chainId) !== parseInt(chainIdETH)) {
      window.location.reload();
    }
  }
  const checkWalletIsConnected = () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      console.log("`````````````");
    } else {
      console.log("Wallet exists! let's go!");
    }
  };

  const connectWalletHandler = async () => {
    if (!ethereum) {
      alert("Please install Metamask!");
    }
    try {
      // Prompt user to switch to Polygon
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdETH }],
      });
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      console.log(chainId);
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdETH }],
        });
      }
      if (switchError.code === 4902) {
        try {
          // await ethereum.request({
          //   method: "wallet_addEthereumChain",
          //   params: [
          //     {
          //       chainId: "0x89",
          //       chainName: "Polygon mainnet",
          //       rpcUrls: ["https://polygon-rpc.com/"],
          //     },
          //   ],
          // });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const account = accounts[0];

      console.log(accounts);

      const web3Provider = new providers.Web3Provider(window.ethereum);

      const signer = web3Provider.getSigner();
      const network = await web3Provider.getNetwork();

      return [account, signer, network.chainId];
    } catch (error) {
      console.log(error);
    }
  };
  const connectWalletConnectHandler = async () => {
    try {
      //  Create WalletConnect Provider
      let provider = new WalletConnectProvider({
        infuraId: "9aa3d95b3bc440fa88ea12eaa4456161",
      });
      // await provider.connector.killSession();
      //  Enable session (triggers QR Code modal)
      await provider.enable();
      console.log(provider);

      if (provider.chainId !== parseInt(chainIdETH)) {
        console.log("Switching to chainId:", chainIdETH);
        try {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainIdETH }],
          });
          console.log("Successfully switched to chainId:", chainIdETH);
        } catch (error) {
          console.error("Failed to switch to chainId:", chainIdETH, error);
        }
      }

      console.log(provider.connected);
      const web3Provider = new providers.Web3Provider(provider);
      setWeb3Provider(web3Provider);
      const account = web3Provider.provider.accounts[0];

      const signer = web3Provider.getSigner();
      const network = await web3Provider.getNetwork();

      provider.on("chainChanged", (chainId) => {
        console.log(chainId);
      });

      return [account, signer, network.chainId];
    } catch (error) {
      console.log(error);
    }
  };

  const signEIP712Message = async (signer, chainId) => {
    const types = {
      VerifyClaim: [
        { name: "userAddress", type: "address" },
        { name: "randNo", type: "uint256" },
        { name: "amount", type: "uint256" },
      ],
    };
    const domainData = {
      name: "My amazing dApp",
      version: "2",
      chainId: parseInt(chainId, 10),
      verifyingContract: contractAddress,
    };
    const randomHex = utils.randomBytes(32);
    var message = {
      userAddress: await signer.getAddress(),
      randNo: randomHex,
      amount: mintAmount,
    };
    const signature = await signer._signTypedData(domainData, types, message);

    return signature;
  };

  const connectandsign = async () => {
    let [account, signer, chainId] = await connectWalletHandler();

    await signEIP712Message(signer, chainId);
    setCurrentAccount(account);
    setMetamask(true);
  };
  const connectandsignWalletConnect = async () => {
    let [account, signer, chainId] = await connectWalletConnectHandler();

    await signEIP712Message(signer, chainId);
    setCurrentAccount(account);
    console.log(account);
    setWalletSigner(signer);
  };
  const disconnect = async () => {
    window.location.reload();
    sessionStorage.removeItem("myAddress");
    localStorage.clear();
    console.log("断开连接");
  };

  const mintNftHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("ethereum object does not exist!");
    }
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const nftcontract = new ethers.Contract(contractAddress, abi, signer);
      let tx = await nftcontract.mint(mintAmount);
      console.log("Minting..please await");

      console.log(`Please See: https://goerli.etherscan.io/tx/${tx.hash}`);
      let message_ = `https://goerli.etherscan.io/tx/${tx.hash}`;
      setMessage(message_);
      await tx.wait();
      console.log("Success Minted!");
    } catch (error) {
      console.log(error);
    }
  };
  const mintNftWalletConnectHandler = async () => {
    try {
      const signer = await web3Provider.getSigner();
      console.log(signer);
      const nftcontract = new ethers.Contract(contractAddress, abi, signer);
      console.log(nftcontract);
      let tx = await nftcontract.mint(mintAmount);
      console.log(tx);
      console.log("Minting..please await");
      console.log(`Please See: https://goerli.etherscan.io/tx/${tx.hash}`);
      let message_ = `https://goerli.etherscan.io/tx/${tx.hash}`;
      setMessage(message_);
      await tx.wait();
      console.log("Success Minted!");
    } catch (error) {
      console.log(error);
    }
  };

  const connectMeatamask = () => {
    return (
      <button
        onClick={connectandsign}
        className="cta-button connect-wallet-button"
      >
        Connect Meatamask Wallet
      </button>
    );
  };
  const connectWalletConnect = () => {
    return (
      <button
        onClick={connectandsignWalletConnect}
        className="cta-button connect-wallet-button"
      >
        Connect WalletConnect Wallet
      </button>
    );
  };
  const disConnect = () => {
    return (
      <button onClick={disconnect} className="cta-button connect-wallet-button">
        DisConnect Wallet
      </button>
    );
  };

  const mintNftButton = (type) => {
    if (type === 0) {
      return (
        <button onClick={mintNftHandler} className="cta-button mint-nft-button">
          Meatamask Mint NFT
        </button>
      );
    }
    if (type === 1) {
      return (
        <button
          onClick={mintNftWalletConnectHandler}
          className="cta-button mint-nft-button"
        >
          WalletConnect Mint NFT
        </button>
      );
    }
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className="main-app">
      <h1>Scrappy Squirrels Tutorial</h1>
      <div>
        <h2>Meatamask</h2>
        {metamask ? mintNftButton(0) : connectMeatamask()}
      </div>

      <div>
        <h2>WalletConnect</h2>
        {walletSigner ? mintNftButton(1) : connectWalletConnect()}
      </div>

      <div>
        <h2>DisConnect</h2>
        {disConnect()}
      </div>

      <div>
        <h2>
          Please See:
          <a href={message} target="_blank">
            {message}
          </a>
        </h2>
      </div>
    </div>
  );
}

export default App;
