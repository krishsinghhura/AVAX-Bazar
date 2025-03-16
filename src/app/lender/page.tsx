"use client";
import { useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const [loading, setLoading] = useState(false);

  const handleLending = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.href = "/lender/actions";
    }, 2000); // Simulating loading time
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white">
      {/* Header */}
      <header className="text-xl font-bold text-white">
        AVAX Lending Platform
      </header>

      {/* Main Content */}
      <main className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center md:text-left">
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold text-white">
            Become a Lender and Earn Daily Interest
          </h1>
          <p className="text-lg leading-relaxed text-gray-400">
            As a lender, you can provide AVAX tokens to our smart contract and
            earn a fixed daily interest rate of{" "}
            <span className="text-white font-semibold">0.5%</span>. Your funds
            remain secure within the decentralized protocol, and you can
            withdraw your earnings at any time.
          </p>
          <p className="text-lg leading-relaxed text-gray-400">
            Take advantage of the power of blockchain to grow your AVAX holdings
            passively and securely.
          </p>
          <button
            onClick={handleLending}
            className="bg-white text-black px-6 py-3 text-lg font-medium rounded-lg hover:bg-gray-300 transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Start Lending"}
          </button>
        </div>
        <div className="ml-40">
          <Image
            src="https://subnets.avax.network/icon-192.png"
            alt="Lending Illustration"
            className="  rounded-lg shadow-lg grayscale"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-sm text-gray-500">
        &copy; 2025 AVAX Lending. All Rights Reserved.
      </footer>
    </div>
  );
}
