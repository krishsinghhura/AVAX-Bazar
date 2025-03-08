"use client";
import { useState } from "react";
import { ethers } from "ethers";
import ABI from "./ContractAbi.json";
import Cookies from "js-cookie";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const ContractAddress = process.env.NEXT_PUBLIC_LOGIN_CONTRACT_ADDRESS ?? "";
  const ContractAbi = ABI.abi;

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
      setContract(auth);
      return { auth, address };
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleSignup = async () => {
    const { auth } = (await connectWallet()) ?? {};
    if (!auth) {
      console.error("Contract is not connected");
      return;
    }
    try {
      const tx = await auth.signup();
      await tx.wait();
      Cookies.set("token", auth.toString());
    } catch (error: any) {
      console.error("Signup error:", error);
    }
  };

  const handleLogin = async () => {
    const wallet = await connectWallet();
    if (!wallet || !wallet.auth) {
      console.error("Contract is not connected");
      return;
    }
    try {
      const check = await wallet.auth.login(wallet.address);
      if (check) {
        Cookies.set("token", wallet.address);
      } else {
        console.error("You dont have an account");
      }
    } catch (error: any) {
      console.error(error);
    }
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
          onClick={() => {
            setIsLogin(false);
          }}
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
            >
              <img
                src="https://imgs.search.brave.com/CqYi1p9h3_jS3mMC_dKXliPWZVxKOODjFS4uwiI1550/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Y3J5cHRvLW5hdGlv/bi5pby9jbi1maWxl/cy91cGxvYWRzLzIw/MjAvMTAvbWV0YW1h/c2stbG9nby0zMDB4/MjI1LnBuZw"
                alt="Metamask"
                className="w-6 h-6 mr-2"
              />
              Login with MetaMask
            </button>
          </div>
        ) : (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-semibold">Sign Up</h2>
            <button
              onClick={handleSignup}
              className="w-full flex items-center justify-center bg-white text-black px-6 py-3 text-lg font-medium rounded-lg hover:bg-gray-300 transition mt-4"
            >
              <img
                src="https://imgs.search.brave.com/CqYi1p9h3_jS3mMC_dKXliPWZVxKOODjFS4uwiI1550/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Y3J5cHRvLW5hdGlv/bi5pby9jbi1maWxl/cy91cGxvYWRzLzIw/MjAvMTAvbWV0YW1h/c2stbG9nby0zMDB4/MjI1LnBuZw"
                alt="Metamask"
                className="w-6 h-6 mr-2"
              />
              Sign Up with MetaMask
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
