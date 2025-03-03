"use client";
import { useState } from "react";
import { ethers } from "ethers";

const BorrowForm = () => {
  const [borrowAmount, setBorrowAmount] = useState("");
  const [collateralAmount, setCollateralAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Contract Addresses
  const contractABI = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "OwnableInvalidOwner",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "OwnableUnauthorizedAccount",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "borrower",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "collateralToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "collateralAmount",
          type: "uint256",
        },
      ],
      name: "Borrowed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "lender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Deposited",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "borrower",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "liquidator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "collateralToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "collateralAmount",
          type: "uint256",
        },
      ],
      name: "Liquidated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "borrower",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Repaid",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_collateralToken",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_collateralAmount",
          type: "uint256",
        },
      ],
      name: "borrowFunds",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "depositFunds",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "deposits",
      outputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "depositTime",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "interestRate",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "lenderRate",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_borrower",
          type: "address",
        },
      ],
      name: "liquidateLoan",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "loans",
      outputs: [
        {
          internalType: "address",
          name: "borrower",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "collateralAmount",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "collateralToken",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "interestRate",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "borrowTime",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "dueDate",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "repaid",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "repayLoan",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "totalDeposits",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "withdrawFunds",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const contractAddress = "0x06Ddc3e8Bcce2F27285b652687cDaD536F6EE778";
  const usdcAddress = "0x5425890298aed601595a70AB815c96711a31Bc65";

  // Connect to MetaMask and return a signer
  const connectWallet = async () => {
    if (!window.ethereum) throw new Error("MetaMask not detected");

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    return await provider.getSigner();
  };

  // Handle Borrowing USDC to get AVAX
  const handleBorrow = async () => {
    setLoading(true);
    setError("");

    try {
      const signer = await connectWallet();

      // Contract instances
      const loanContract = new ethers.Contract(
        contractAddress,
        contractABI, // Make sure you import the updated ABI
        signer
      );
      const usdcContract = new ethers.Contract(
        usdcAddress,
        [
          "function approve(address spender, uint256 amount) public returns (bool)",
        ],
        signer
      );

      // Convert amounts
      const borrowAmountWei = ethers.parseEther(borrowAmount); // AVAX (18 decimals)
      const collateralAmountWei = ethers.parseUnits(collateralAmount, 6); // USDC (6 decimals)

      // Step 1: Approve USDC Transfer
      const approveTx = await usdcContract.approve(
        contractAddress,
        collateralAmountWei
      );
      await approveTx.wait();

      // Step 2: Call Borrow Function
      const borrowTx = await loanContract.borrowFunds(
        borrowAmountWei,
        usdcAddress,
        collateralAmountWei
      );
      await borrowTx.wait();

      alert("Borrow successful!");
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">LoanPool Borrow</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Borrow Amount (AVAX):
          </label>
          <input
            type="number"
            value={borrowAmount}
            onChange={(e) => setBorrowAmount(e.target.value)}
            placeholder="Enter AVAX amount"
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Collateral Amount (USDC):
          </label>
          <input
            type="number"
            value={collateralAmount}
            onChange={(e) => setCollateralAmount(e.target.value)}
            placeholder="Enter USDC amount"
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleBorrow}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {loading ? "Borrowing..." : "Borrow"}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default BorrowForm;
