import React, { useEffect, useState } from 'react'

export const TransactionContext = React.createContext();
const {ethereum} = window;
import {ethers} from 'ethers';
import abi from '../contractJson/Transactions.json';

const contractABI= abi.abi;
const contractAddress='0xb95FC92fce126125dc2538Db48EAabE41a4979Fe';

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
  
    return transactionContract;
};

export const TransactionProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setFormData] = useState({
        addressTo: "",
        amount: "",
        keyword:"",
        message: "",
      });
    
    const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
    );

    const [totalTransactions, setTotalTransactions] = useState([]);
    
    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
      };

    const getAllTransactions = async ()=>{
        try {
            if(!ethereum) return alert("Please install Metamask");
            const transactionsContract = getEthereumContract();
            const availableTransactions = await transactionsContract.getAllTransactions();

            setTotalTransactions(availableTransactions);
            return availableTransactions;
        } catch (error) {
            console.log(error);
            
        }

    }

    const checkIfWalletIsConnected = async ()=>{
        try {
            if(!ethereum) return alert("Please install Metamask");
            const accounts = await ethereum.request({
            method: "eth_accounts"
            });
            if(accounts.length){
                setCurrentAccount(accounts[0]);

                getAllTransactions();
            }
            else{
                console.log("No accounts found");
            }
            
        } catch (error) {
            throw new Error("No ethereum object");   
        }
    }

    const connectWallet = async ()=>{
        try {
            if(!ethereum) return alert("Please install Metamask");
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object");
        }
    };

    const sendTransaction = async ()=>{
        try {
            if(!ethereum) return alert("Please install Metamask");
            const {addressTo, amount, keyword, message} = formData;
            const transactionsContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: "eth_sendTransaction",
                params: [
                    {
                        from: currentAccount,
                        to: addressTo,
                        gas: "0x5208",
                        value: parsedAmount._hex,
                    },
                ],
            });

            const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            const transactionsCount = await transactionsContract.getTransactionCount();
            
            setTransactionCount(transactionsCount.toNumber());
            window.location.reload();
            

        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object");
        }
    };

    useEffect(()=>{
        checkIfWalletIsConnected();
    },[]);

    return (
        <TransactionContext.Provider
            value={{
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
            }}
        >
            {children}
        </TransactionContext.Provider>
    );



};