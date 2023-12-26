const { PublicKey } = require("@solana/web3.js");

const getPhantomProvider = async () => {
  if ("phantom" in window) {
    const provider = await window.phantom?.solana;

    if (provider?.isPhantom) {
      // Connect to the Phantom wallet
      await provider.connect();

      // Handle disconnect event
      provider.on("disconnect", () => {
        console.log("Disconnected from Phantom wallet");
        localStorage.removeItem("currentSolanaAccount");
        // You can implement your logic here when the wallet is disconnected
      });

      provider.on("accountChanged", (publicKey) => {
        if (publicKey) {
          // Set new public key and continue as usual
          console.log(`Switched to account ${publicKey.toBase58()}`);
          localStorage.setItem("currentSolanaAccount", publicKey.toBase58());
        } else {
          // Attempt to reconnect to Phantom
          provider.connect().catch((error) => {
            // Handle connection failure
          });
        }
      });
      return provider;
    }
  }

  window.open("https://phantom.app/", "_blank");
};

module.exports = { getPhantomProvider };
