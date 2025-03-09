"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import abi from "../ContractAbi.json";
import tokens from "./TokenData.json"; // Importing the JSON file
const ABI = abi;

interface Transaction {
  nativeTransaction: {
    value: string;
  };
  internalTransactions?: { value: string }[];
}

export default function BorrowActions() {
  const conAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [borrowAmount, setBorrowAmount] = useState("");
  const [collateralAmount, setCollateralAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState(tokens[0]); // Default to first token
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState("");
  const [repayAmount, setRepayAmount] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install Metamask first");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
    } catch (error: any) {
      console.error(error);
    }
  };

  const connection = async () => {
    try {
      const contract = new ethers.Contract(conAddress, ABI, signer);
      console.log(contract);
      return contract;
    } catch (error: any) {
      console.error(error);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await axios.get(
        `https://glacier-api.avax.network/v1/chains/43113/addresses/${conAddress}/transactions?pageSize=20`
      );
      let totalDeposits = 0;
      let totalWithdrawals = 0;
      res.data.transactions.forEach((tx: Transaction) => {
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

  useEffect(() => {
    connectWallet();
    fetchBalance();
  }, []);

  const handleBorrow = async () => {
    const contract = await connection();

    if (!contract) {
      console.error("error making contract");
      return;
    }
    const loans = await contract.loans(
      "0x1a6A42032a78538c69f1FCf7c617cEAFc4433933"
    );
    console.log(loans);

    if (!selectedToken) {
      alert("Please select a token!");
      return;
    }

    const tokenAddress = selectedToken.contract_address;
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        "function approve(address spender, uint256 amount) public returns (bool)",
      ],
      signer
    );

    const borrowAmountWei = ethers.parseEther(borrowAmount);
    const collateralAmountWei = ethers.parseUnits(collateralAmount, 6);
    try {
      const approveTx = await tokenContract.approve(
        contract.target,
        collateralAmountWei
      );
      await approveTx.wait();
      console.log("Approve TX:", approveTx);

      const borrowTx = await contract.borrowFunds(
        borrowAmountWei,
        tokenAddress,
        collateralAmountWei
      );
      await borrowTx.wait();

      alert("Borrow successful!");
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleRepay = async () => {
    const contract = await connection();
    if (!contract) {
      console.error("Contract not found");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); // Get the connected wallet
      const userAddress = await signer.getAddress(); // Fetch user's wallet address

      // Estimate gas
      const gasLimit = await contract.repayLoan.estimateGas({
        from: userAddress,
        value: ethers.parseEther(repayAmount), // Ensure repayAmount is correctly set
      });

      // Execute repayment transaction
      const tx = await contract.repayLoan({
        from: userAddress,
        value: ethers.parseEther(repayAmount), // Convert repayAmount to ether
        gasLimit,
      });

      await tx.wait();
      alert("Loan repaid successfully!");
    } catch (error) {
      console.error("Repayment failed:", error);
      alert("Repayment failed! Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-900 p-8 rounded-lg shadow-lg">
        {/* Borrow Section */}
        <div>
          <h1 className="text-2xl font-bold text-center mb-2">
            LoanPool Borrow
          </h1>
          <p className="text-center text-gray-400 mb-6">
            Smart Contract Balance: {balance}
          </p>
          <div className="space-y-4">
            {/* Token Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Select Collateral Token:
              </label>
              <select
                value={selectedToken.symbol}
                onChange={(e) =>
                  setSelectedToken(
                    tokens.find((token) => token.symbol === e.target.value) ||
                      tokens[0]
                  )
                }
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              >
                {tokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.token_name} ({token.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Borrow Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Borrow Amount (AVAX):
              </label>
              <input
                type="number"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                placeholder="Enter AVAX amount"
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            {/* Collateral Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Collateral Amount ({selectedToken.symbol}):
              </label>
              <input
                type="number"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
                placeholder={`Enter in ${selectedToken.token_name}`}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>

            <button
              onClick={handleBorrow}
              disabled={loading}
              className="w-full px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? "Borrowing..." : "Borrow"}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>

        {/* Repayment Section */}
        <div className="border-l border-gray-700 pl-8">
          <h2 className="text-2xl font-bold text-center mb-6">Repay Loan</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Repayment Amount (AVAX):
              </label>
              <input
                type="number"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                placeholder="Enter AVAX amount"
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <button
              onClick={handleRepay}
              className="w-full px-4 py-2 bg-gray-700 text-white font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Repay Loan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
