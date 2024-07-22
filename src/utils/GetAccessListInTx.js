const getAccessList = async (provider, transaction) => {
  try {
    const result = await provider.send("eth_createAccessList", [transaction]);
    return result;
  } catch (error) {
    return null;
  }
};

export { getAccessList };
