"use client";
import { useState } from "react";
import { ethers } from "ethers";
import ABI from "./ContractAbi.json";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState("lender");
  const [loading, setLoading] = useState(false);
  const ContractAddress = process.env.NEXT_PUBLIC_LOGIN_CONTRACT_ADDRESS ?? "";
  const ContractAbi = ABI.abi;
  const Router = useRouter();

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask first");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const auth = new ethers.Contract(ContractAddress, ContractAbi, signer);
      return { auth, address };
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    const { auth } = (await connectWallet()) ?? {};
    if (!auth) {
      console.error("Contract is not connected");
      setLoading(false);
      return;
    }
    try {
      const tx = await auth.signup();
      await tx.wait();
      const addres = auth.getAddress();

      await axios.post("/api/users", {
        address: addres,
        role: userType,
      });
      Cookies.set("token", auth.toString());
    } catch (error: any) {
      console.error("Signup error:", error);
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    const wallet = await connectWallet();
    if (!wallet || !wallet.auth) {
      console.error("Contract is not connected");
      setLoading(false);
      return;
    }
    try {
      const check = await wallet.auth.login(wallet.address);
      if (check) {
        const response = await axios.get(
          `/api/users?address=${wallet.address}`
        );
        if (response.data.role === "LENDER") {
          Router.push("/lender");
        } else if (response.data.role === "BORROWER") {
          Router.push("/borrower");
        }
        Cookies.set("token", wallet.address);
      } else {
        console.error("You don’t have an account");
      }
    } catch (error: any) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-8 sm:p-20">
      {/* Navbar */}
      <nav className="max-w-3xl flex justify-between p-4 bg-gray-900 rounded-3xl shadow-lg mb-8">
        <button
          className={`text-lg font-medium px-4 py-2 rounded-3xl transition-all duration-500 ${
            isLogin ? "bg-white text-black" : "bg-gray-600 hover:bg-gray-500"
          }`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`text-lg font-medium px-4 ml-10 py-2 rounded-3xl transition-all duration-500 ${
            !isLogin ? "bg-white text-black" : "bg-gray-600 hover:bg-gray-500"
          }`}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </nav>

      {/* Authentication Container */}
      <div className="relative max-w-2xl w-full h-96 p-8 rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
        {isLogin ? (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-semibold">Login</h2>
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center bg-white text-black px-6 py-3 text-lg font-medium rounded-lg hover:bg-gray-300 transition mt-4"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login with MetaMask"}
            </button>
          </div>
        ) : (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-semibold">Sign Up</h2>
            <select
              className="w-full p-3 rounded bg-gray-700 text-white outline-none mt-4"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              disabled={loading}
            >
              <option value="LENDER">Lender</option>
              <option value="BORROWER">Borrower</option>
            </select>
            <button
              onClick={handleSignup}
              className="w-full flex items-center justify-center bg-white text-black px-6 py-3 text-lg font-medium rounded-lg hover:bg-gray-300 transition mt-4"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up with MetaMask"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
