"use client";
import { useState } from "react";
import Image from "next/image";

export default function BorrowerPage() {
  const [loading, setLoading] = useState(false);

  const handleBorrowing = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.href = "/borrower/actions";
    }, 2000); // Simulating loading time
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white">
      {/* Header */}
      <header className="text-xl font-bold text-white">
        AVAX Borrowing Platform
      </header>

      {/* Main Content */}
      <main className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center md:text-left">
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold text-white">
            Borrow AVAX with Low Collateral Requirements
          </h1>
          <p className="text-lg leading-relaxed text-gray-400">
            As a borrower, you can obtain AVAX tokens by providing collateral.
            Our platform ensures a seamless and decentralized experience,
            allowing you to access liquidity instantly.
          </p>
          <p className="text-lg leading-relaxed text-gray-400">
            With competitive interest rates and a secure smart contract, you can
            borrow confidently while maintaining full control over your assets.
          </p>
          <button
            onClick={handleBorrowing}
            className="bg-white text-black px-6 py-3 text-lg font-medium rounded-lg hover:bg-gray-300 transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Start Borrowing"}
          </button>
        </div>
        <div className="ml-40">
          <Image
            src="https://subnets.avax.network/icon-192.png"
            alt="Borrowing Illustration"
            className="rounded-lg shadow-lg grayscale"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-sm text-gray-500">
        &copy; 2025 AVAX Borrowing. All Rights Reserved.
      </footer>
    </div>
  );
}
