const getAccessList = async (provider, transaction) => {
  const result = await provider.send("eth_createAccessList", [transaction]);
  return result;
};

export { getAccessList };
