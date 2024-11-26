const { formatEther, formatUnits } = require("ethers/lib/utils");

const estimateTxFee = async (provider, from, to, data, value) => {
  const gasPrice = await provider.getGasPrice();

  console.log(`Gas Price: ${formatUnits(gasPrice, 9)} Gwei`);

  // Query the blockchain (replace example parameters)
  const estGas = await provider.estimateGas({
    from: from,
    to: to == "" ? null : to,
    data: data,
    value: value,
    gasPrice: gasPrice
  });

  // Print the output to console
  console.log(`Gas Used: ${estGas.toString()}`);

  const estFees = estGas.mul(gasPrice);

  console.log(`Transaction Fee: ${formatEther(estFees.toBigInt())} Ether`);

  return {
    gasPrice: formatUnits(gasPrice, 9),
    gasUsed: estGas.toString(),
    fee: formatEther(estFees.toBigInt())
  };
};

module.exports = { estimateTxFee };
