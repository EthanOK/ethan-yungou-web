const sendTransactionOfPhantom = async (connection, provider, transaction) => {
  try {
    let { blockhash } = await connection.getLatestBlockhash("finalized");
    transaction.feePayer = provider.publicKey;
    transaction.recentBlockhash = blockhash;

    const { signature } = await provider.signAndSendTransaction(transaction);

    await connection.getSignatureStatus(signature);
    return signature;
  } catch (error) {
    return null;
  }
};

module.exports = { sendTransactionOfPhantom };
