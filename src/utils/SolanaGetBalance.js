const { PublicKey } = require("@solana/web3.js");

const getSolBalance = async (connection, ownerAddress) => {
  let balance;

  try {
    balance = await connection.getBalance(new PublicKey(ownerAddress));
    return balance;
  } catch (error) {
    return balance;
  }
};
module.exports = { getSolBalance };
