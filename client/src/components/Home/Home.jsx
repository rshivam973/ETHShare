import React, { useEffect } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { useContext } from "react";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

const commonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const slice = (address) => `${address.slice(0,5)}...${address.slice(address.length-4)}`;

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const Home = () => {
  const {
    connectWallet,
    currentAccount,
    setCurrentAccount,
    formData,
    setFormData,
    sendTransaction,
    handleChange,
    getAllTransactions,
    totalTransactions,
    transactionCount
  } = useContext(TransactionContext);

  const handleSubmit = (e) => {
    const { addressTo, amount, keyword, message } = formData;

    e.preventDefault();
    console.log("handleSubmit");
    console.log(formData);

    if (!addressTo || !amount || !keyword || !message) return;

    sendTransaction();
    console.log("transaction done");
  };

  //   const handleChange = () => {};
  //   const connectWallet = () => {};
  //   const currentAccount = "avx";

  useEffect(()=>{
    const handleAccountsChanged = () => {
        window.location.reload();
      };
    
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
      console.log(totalTransactions);
      console.log("hello");

  },[]);

  return (
    <>
    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
      
      <div className="text-center ml-20 w-1/2">
        <p className="text-white text-5xl mt-0 flex h-30">
          Send ETH seamlessly from one account to other.
        </p>
        {!currentAccount && (
        <button
          className="text-white bg-blue-600 mt-8 rounded-3xl hover:bg-blue-700 px-6 py-3 text-xl"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
        )}
      </div>

      <div className="justify-end w-50 mr-40 sm:flex-row sm:items-center">

      <div className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className="text-white font-light text-sm">{slice(String(currentAccount))}</p>
                <p className="text-white font-semibold text-lg mt-1">
                  Ethereum
                </p>
              </div>
            </div>
          </div>


        {/* Place other content here if needed */}
        <div className="w-full sm:w-96 p-5 sm:p-10 blue-glassmorphism">
          <Input
            placeholder="Address To"
            name="addressTo"
            type="text"
            handleChange={handleChange}
          />
          <Input
            placeholder="Amount (ETH)"
            name="amount"
            type="number"
            handleChange={handleChange}
          />
          
          <Input
            placeholder="Keyword"
            name="keyword"
            type="text"
            handleChange={handleChange}
          />

          <Input
            placeholder="Enter Message"
            name="message"
            type="text"
            handleChange={handleChange}
          />

          <div className="h-[1px] w-full bg-gray-400 my-2" />

          <button
            type="button"
            onClick={handleSubmit}
            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer hover:bg-blue-700"
          >
            Send Now
          </button>
        </div>
      </div>



    </div>
        
    {currentAccount ? (
    <div className="text-white container py-20 px-5">
    <div className="px-2">
        <h3 style={{ textAlign: "center", marginTop: "20px" , fontSize: '30px'}}>Messages</h3>
        <table className="px-10">
        <tbody>
        <tr>
                    <td align="center" className="items-center font-bold text-lg" style={{border: "1px solid white"}}>From</td>
                    <td align="center" className="font-bold" style={{border: "1px solid white"}}>To</td>
                    <td align="center" className="font-bold text-lg" style={{border: "1px solid white"}}>Timestamp</td>
                    <td align="center" style={{border: "1px solid white"}}>Message</td>
                </tr>
          {totalTransactions.map((memo) => {
            return (
                <>
                
              <tr>
                <td
                  style={{
                    background: "transparent",
                    border: "1px solid white",
                    borderCollapse: "collapse",
                    padding: "7px",
                    width: "140px",
                    color: "white",
                    alignContent: "center"
                  }}
                >
                  {slice(memo.sender)}
                </td>
                <td
                  style={{
                    background: "transparent",
                    border: "1px solid white",
                    borderCollapse: "collapse",
                    padding: "7px",
                    width: "140px",
                    color: "white",
                  }}
                >
                  {slice(memo.receiver)}
                </td>
                <td
                  style={{
                    background: "transparent",
                    border: "1px solid white",
                    borderCollapse: "collapse",
                    padding: "7px",
                    width: "800px",
                    color: "white",
                  }}
                >
                  {new Date(memo.timestamp * 1000).toLocaleString()}
                </td>
                <td
                  style={{
                    background: "transparent",
                    border: "1px solid white",
                    borderCollapse: "collapse",
                    padding: "7px",
                    width: "300px",
                    color: "white",
                  }}
                >
                  {memo.message}
                </td>
                
              </tr>
              </>
            );
          })}
        </tbody>
      </table>

      <div className="mt-7 text-xl">
        <p>Total Transactions done: {totalTransactions.length}</p>
      </div>

        

    </div>
    

    </div>
    ):(
        <div className="text-white container py-20 px-5">
          <p style={{ textAlign: "center" }}>Please connect your wallet to view messages and total transactions.</p>
        </div>
    )}
    </>
  );
};

export default Home;
