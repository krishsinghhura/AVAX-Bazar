"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import abi from "../ContractAbi.json";
const ABI = abi.abi;

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface NativeTransaction {
  value: string;
  blockTimestamp: number;
}

interface InternalTransaction {
  value: string;
}

interface Transaction {
  nativeTransaction: NativeTransaction;
  internalTransactions?: InternalTransaction[];
}

interface TransactionsData {
  transactions: Transaction[];
}

export default function TransactionsPage() {
  const [depositAmount, setDepositAmount] = useState("");
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState("");
  const [transactionsData, setTransactionsData] = useState<TransactionsData>({
    transactions: [],
  });
  const [balance, setBalance] = useState("0");

  const conAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";

  const connection = async () => {
    const contract = new ethers.Contract(conAddress, ABI, signer);
    return contract;
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask first");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      const address = await signer.getAddress();
      setAccount(address);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await axios.get<TransactionsData>(
        `https://glacier-api.avax.network/v1/chains/43113/addresses/${conAddress}/transactions?pageSize=20`
      );
      setTransactionsData(res.data);
      let totalDeposits = 0;
      let totalWithdrawals = 0;
      res.data.transactions.forEach((tx) => {
        if (tx.nativeTransaction.value !== "0") {
          totalDeposits += parseFloat(tx.nativeTransaction.value) / 1e18;
        }
        if (tx.internalTransactions?.length) {
          totalWithdrawals +=
            parseFloat(tx.internalTransactions[0].value) / 1e18;
        }
      });
      setBalance((totalDeposits - totalWithdrawals).toFixed(4));
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const depositFunds = async () => {
    if (!depositAmount) {
      alert("Set deposit amount first");
      return;
    }
    try {
      const contract = await connection();
      const tx = await contract.depositFunds({
        value: ethers.parseEther(depositAmount),
      });
      await tx.wait();
      alert("Deposit successful");
      fetchBalance();
    } catch (error) {
      console.error(error);
    }
  };

  const withdraw = async () => {
    try {
      const contract = await connection();
      const tx = await contract.withdrawFunds();
      await tx.wait();
      alert("Withdraw successful");
      fetchBalance();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    connectWallet();
    fetchBalance();
  }, []);

  return (
    <div className="min-h-screen p-8 pb-20 bg-black text-white font-geist-sans">
      <header className="text-xl font-bold text-center mb-8">
        Lender Transactions
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Deposit Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">Deposit More</h2>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <input
              type="number"
              placeholder="Enter amount to deposit"
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <button
              className="mt-4 w-full bg-white text-black px-6 py-3 text-lg font-medium rounded-lg hover:bg-gray-300 transition"
              onClick={depositFunds}
            >
              Deposit
            </button>
            <button
              className="mt-4 w-full bg-blue-500 text-white px-6 py-3 text-lg font-medium rounded-lg hover:bg-blue-300 transition"
              onClick={withdraw}
            >
              Withdraw last Deposit
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">Transaction History</h2>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <ul className="space-y-4">
              {transactionsData.transactions.map((tx, index) => {
                const { nativeTransaction, internalTransactions } = tx;
                const isDeposit = nativeTransaction.value !== "0";
                const amount = isDeposit
                  ? `${parseFloat(nativeTransaction.value) / 1e18} AVAX`
                  : `$${
                      parseFloat(internalTransactions?.[0]?.value || "0") / 1e18
                    } AVAX`;
                const date = new Date(
                  nativeTransaction.blockTimestamp * 1000
                ).toLocaleDateString();

                return (
                  <li key={index} className="bg-gray-700 p-4 rounded-md">
                    {isDeposit
                      ? `Deposited ${amount} on ${date}`
                      : `Withdrew ${amount} on ${date}`}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>

      <footer className="text-sm text-gray-500 text-center mt-8">
        &copy; 2025 AVAX Lending. All Rights Reserved.
      </footer>
    </div>
  );
}
