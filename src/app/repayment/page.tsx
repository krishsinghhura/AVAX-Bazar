"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

const contractAddress = "0x06Ddc3e8Bcce2F27285b652687cDaD536F6EE778";
const abi = [
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
    name: "collateralizationRatio",
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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
      {children}
    </div>
  );
}

function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function Button({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="mt-4 w-full bg-green-500 hover:bg-green-600 p-2 rounded"
    >
      {children}
    </button>
  );
}

function Input({
  type,
  placeholder,
  value,
  onChange,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="mt-4 p-2 rounded-md text-black w-full"
    />
  );
}

export default function LoanRepayment() {
  const [loanDetails, setLoanDetails] = useState<any | null>(null);
  const [repaymentAmount, setRepaymentAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      provider.send("eth_requestAccounts", []).then(() => {
        provider.getSigner().then((signer) => {
          setSigner(signer);
          const contract = new ethers.Contract(contractAddress, abi, signer);
          setContract(contract);
          fetchLoanDetails(contract, signer);
        });
      });
    }
  }, []);

  const fetchLoanDetails = async (contract: any, signer: any) => {
    try {
      const address = await signer.getAddress();
      const loan = await contract.loans(address); // Fetch loan details

      console.log("Raw loan data:", loan);
      console.log("Type of loan[1]:", typeof loan[1], "Value:", loan[1]);

      // Ensure loan amount is valid
      if (loan[1] === undefined || loan[1] === null) {
        console.error("Loan[1] is undefined or null.");
        return;
      }

      // Convert BigInt safely
      const loanAmount = loan[1] !== 0n ? Number(loan[1]) : 0;
      const interestRate = loan[4] !== 0n ? Number(loan[4]) : 0;
      const borrowTime = loan[5] !== 0n ? Number(loan[5]) : 0;
      const dueTimestamp = loan[6] !== 0n ? Number(loan[6]) : 0;

      console.log("Parsed values:", {
        loanAmount,
        interestRate,
        borrowTime,
        dueTimestamp,
      });

      if (loanAmount > 0) {
        const amount = ethers.formatEther(loanAmount.toString()); // Convert loan amount
        const dueDate = new Date(dueTimestamp * 1000).toLocaleDateString();
        const daysElapsed = (Date.now() / 1000 - borrowTime) / 86400;
        const totalDue = (
          parseFloat(amount) +
          parseFloat(amount) * (interestRate / 1000) * daysElapsed
        ).toFixed(4);

        console.log("Final Loan Details:", {
          amount,
          interestRate,
          totalDue,
          dueDate,
        });

        setLoanDetails({ amount, interestRate, totalDue, dueDate });
      } else {
        console.warn("No active loan found for this address.");
      }
    } catch (error) {
      console.error("Error fetching loan details:", error);
    }
  };

  const handleRepay = async () => {
    if (
      !repaymentAmount ||
      parseFloat(repaymentAmount) < parseFloat(loanDetails?.totalDue ?? "0")
    ) {
      setMessage("Insufficient repayment amount!");
      return;
    }
    try {
      const tx = await contract.repayLoan({
        value: ethers.parseEther(repaymentAmount),
      });
      await tx.wait();
      setMessage("Loan repaid successfully!");
      fetchLoanDetails(contract, signer);
    } catch (error) {
      console.error("Repayment failed:", error);
      setMessage("Repayment failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Loan Repayment</h2>
          {loanDetails ? (
            <>
              <p>Loan Amount: {loanDetails.amount} AVAX</p>
              <p>Interest Rate: {loanDetails.interestRate}%</p>
              <p>Total Due: {loanDetails.totalDue} AVAX</p>
              <p>Due Date: {loanDetails.dueDate}</p>
              <Input
                type="number"
                placeholder="Enter repayment amount"
                value={repaymentAmount}
                onChange={(e) => setRepaymentAmount(e.target.value)}
              />
              <Button onClick={handleRepay}>Repay Loan</Button>
              {message && (
                <p className="mt-2 text-center text-yellow-400">{message}</p>
              )}
            </>
          ) : (
            <p>Loading loan details...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
