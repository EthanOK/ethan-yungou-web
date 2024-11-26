import { useEffect, useState } from "react";
import DataTable from "../utils/table/DataTable.js";
import {
  getSystemData,
  getENSOfAddress,
  getAddressOfENS,
  getENSOfAddressTheGraph,
  getAddressOfENSTheGraph,
  getNameByTokenIdTheGraph,
  getENSOfAddressByContract,
  getENSUniversalResolver,
  getENSByTokenId,
  getPriceBaseUSDT
} from "../api/GetData.js";
import { isAddress } from "../utils/Utils.js";
import { logDOM } from "@testing-library/react";
import { BigNumber } from "ethers";

const DataDisplayPage = () => {
  const [tableData, setTableData] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const [ethPrice, setEthPrice] = useState("");
  const [bnbPrice, setBnbPrice] = useState("");

  useEffect(() => {
    setIsMounted(true);

    // Set up the interval to update the prices every 5 seconds
    const intervalId = setInterval(updatePrices, 5000);

    return () => {
      clearInterval(intervalId);
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      configData();
      updatePrices();
    }
  }, [isMounted]);

  const updatePrices = async () => {
    try {
      let result = await getPriceBaseUSDT();
      if (result.code == 200) {
        let data = result.data;
        setEthPrice(data.ethPrice);
        setBnbPrice(data.bnbPrice);
      }
    } catch (error) {}
  };
  const configData = async () => {
    try {
      let account = localStorage.getItem("userAddress");
      if (account != null) {
        setCurrentAccount(account);
      }
      const data = await getSystemData();
      setTableData(data);
    } catch (error) {}
  };

  const PleaseLogin = () => {
    return <h2>UnLogin, Please Login</h2>;
  };

  return (
    <center>
      {" "}
      <div>
        <h2>
          ETH Price:&nbsp;
          <span style={{ color: "red" }}>{ethPrice}</span>
          &nbsp;USD
          <p></p>
          BNB Price:&nbsp;
          <span style={{ color: "red" }}>{bnbPrice}</span>
          &nbsp;USD
        </h2>
      </div>
      <div>
        <div>
          <h1>Data Table</h1>
          <DataTable data={tableData} />
        </div>
      </div>
    </center>
  );
};

export default DataDisplayPage;
