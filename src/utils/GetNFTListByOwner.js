import { getAlchemyURL } from "./Utils";

const getNFTListByOwner = async (chainId, owner) => {
  let pageKey = "";
  const ownedNfts = [];
  const alchemyURL = getAlchemyURL(chainId);

  while (pageKey != null) {
    let pageKeyStr = "";
    if (pageKey.length > 0) {
      pageKeyStr = `&pageKey=${pageKey}`;
    }

    const res = await fetch(
      alchemyURL +
        `getNFTsForOwner?owner=${owner}&withMetadata=false&pageSize=100` +
        pageKeyStr
    );
    const data = await res.json();

    pageKey = data.pageKey;
    ownedNfts.push(...data.ownedNfts);
  }
  console.log(ownedNfts);
  console.log(ownedNfts.length);
};

const getNFTListByOwnerAndContract = async (chainId, owner, contract) => {
  let pageKey = "";
  const ownedNfts = [];
  // 使用 Set 来确保唯一性
  const tokenIds = new Set();

  const alchemyURL = getAlchemyURL(chainId);
  if (alchemyURL == null) {
    return null;
  }

  while (pageKey != null) {
    let pageKeyStr = "";
    if (pageKey.length > 0) {
      pageKeyStr = `&pageKey=${pageKey}`;
    }
    const res = await fetch(
      alchemyURL +
        `getNFTsForOwner?owner=${owner}&withMetadata=false&pageSize=100` +
        `&contractAddresses[]=${contract}` +
        pageKeyStr
    );
    const data = await res.json();

    pageKey = data.pageKey;
    ownedNfts.push(...data.ownedNfts);
  }

  //
  ownedNfts.forEach((item) => {
    tokenIds.add(item.tokenId);
  });

  return {
    contract: contract,
    tokenIds: Array.from(tokenIds),
    totalCount: tokenIds.size
  };
};

const getContractsForOwner = async (chainId, owner) => {
  let pageKey = "";
  const contracts = [];

  const alchemyURL = getAlchemyURL(chainId);

  if (alchemyURL == null) {
    return null;
  }

  while (pageKey != null) {
    let pageKeyStr = "";
    if (pageKey.length > 0) {
      pageKeyStr = `&pageKey=${pageKey}`;
    }
    const res = await fetch(
      alchemyURL +
        `getContractsForOwner?owner=${owner}&pageSize=100&withMetadata=true` +
        pageKeyStr
    );
    const data = await res.json();

    pageKey = data.pageKey;
    contracts.push(...data.contracts);
  }

  return {
    contracts: contracts,
    totalCount: contracts.length
  };
};

export {
  getNFTListByOwner,
  getNFTListByOwnerAndContract,
  getContractsForOwner
};
