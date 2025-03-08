"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

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
  erc20Transfers?: any[];
}

interface TransactionsData {
  transactions: Transaction[];
}

export default function TransactionsPage() {
  const [transactionsData, setTransactionsData] = useState<TransactionsData>({
    transactions: [],
  });

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install metamask first");
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      const conAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      try {
        const res = await axios.get<TransactionsData>(
          `https://glacier-api.avax.network/v1/chains/43113/addresses/${conAddress}/transactions?pageSize=20`
        );
        console.log("API Response:", res.data); // Log the response
        setTransactionsData(res.data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
    connectWallet();
  }, []);

  return (
    <div className="min-h-screen p-8 pb-20 bg-black text-white font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="text-xl font-bold text-white text-center mb-8">
        Lender Transactions
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Deposit More */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-white">Deposit More</h2>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <input
              type="number"
              placeholder="Enter amount to deposit"
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="mt-4 w-full bg-white text-black px-6 py-3 text-lg font-medium rounded-lg hover:bg-gray-300 transition">
              Deposit
            </button>
          </div>
        </div>

        {/* Right Side: Transaction History */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-white">
            Transaction History
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <ul className="space-y-4">
              {transactionsData.transactions?.map(
                (tx: Transaction, index: number) => {
                  const { nativeTransaction, internalTransactions } = tx;
                  const isDeposit = nativeTransaction.value !== "0";
                  const amount = isDeposit
                    ? `${parseFloat(nativeTransaction.value) / 1e18} AVAX`
                    : `${
                        parseFloat(internalTransactions?.[0]?.value || "0") /
                        1e18
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
                }
              )}
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-sm text-gray-500 text-center mt-8">
        &copy; 2025 AVAX Lending. All Rights Reserved.
      </footer>
    </div>
  );
}
