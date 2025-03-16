"use client";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white">
      {/* Header */}
      <header className="text-xl font-bold text-white">
        AVAX Lending & Borrowing Platform
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Description */}
        <div className="space-y-6 text-left">
          <h1 className="text-3xl font-semibold text-white">
            Decentralized Lending & Borrowing on C-Chain
          </h1>
          <p className="text-lg leading-relaxed text-gray-400">
            Our platform allows depositors to lend AVAX tokens, which are
            securely stored in our smart contract. Borrowers can access these
            funds by providing collateral, ensuring a fair and secure lending
            process.
          </p>
          <p className="text-lg leading-relaxed text-gray-400">
            The platform operates fully on the Avalanche C-Chain, leveraging its
            speed and low transaction fees to provide seamless transactions for
            both lenders and borrowers.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <a href="/auth">
              <button className="bg-white text-black px-6 py-3 text-lg font-medium rounded-lg hover:bg-gray-300 transition">
                Get Started
              </button>
            </a>
          </div>
        </div>

        {/* Right Side - GIF */}
        <div className="flex justify-center">
          <Image
            src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHB5M29ka2R4eGloNnRkdm93dTc1NDdjaHhvdG0yc2V4NHo1cnB0eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Ti6ooRJ8pqe4ZGZV70/giphy.gif"
            alt="Lending and Borrowing Process"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-sm text-gray-500 mt-8">
        &copy; 2025 AVAX Lending & Borrowing. All Rights Reserved.
      </footer>
    </div>
  );
}
