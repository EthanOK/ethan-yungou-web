import { useEffect, useState } from "react";

const GetIPFSPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      configData();
    }
  }, [isMounted]);

  const configData = async () => {
    let account = localStorage.getItem("userAddress");
    if (account != null) {
      setCurrentAccount(account);
    }
  };

  const PleaseLogin = () => {
    return <h2>UnLogin, Please Login</h2>;
  };

  const getIPFSURLHandler = async () => {
    const contractInput = document.getElementById("cid");
    const contractValue = contractInput.value;
    let url = "https://ipfs.io/ipfs/" + contractValue;
    setMessage(url);
  };

  const getIPFSURLButton = () => {
    return (
      <button
        onClick={getIPFSURLHandler}
        className="cta-button mint-nft-button"
      >
        getIPFSURL
      </button>
    );
  };

  return (
    <center>
      <div>
        <h2>IPFS</h2>
        <div className="container">
          <div className="input-container">
            <label className="label">CID:</label>
            <textarea
              className="textarea"
              id="cid"
              placeholder="QmSFZ84W8uNjoZJMkGkVDuJR5PBNtsHorDBmcHCjzACdXY"
            ></textarea>
          </div>
        </div>
        <p></p>
        {currentAccount ? getIPFSURLButton() : PleaseLogin()}
      </div>
      <div>
        <h2>
          Please See:
          <p></p>
          <a href={message} target="_blank" rel="noopener noreferrer">
            {message}
          </a>
        </h2>
      </div>
    </center>
  );
};

export default GetIPFSPage;
