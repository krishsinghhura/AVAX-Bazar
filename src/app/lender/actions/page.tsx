export default function TransactionsPage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white">
      {/* Header */}
      <header className="text-xl font-bold text-white">
        Lender Transactions
      </header>

      {/* Main Content */}
      <main className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-3xl font-semibold text-white">
          Your Transaction History
        </h1>

        {/* Transactions List */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
          <ul className="space-y-4 text-left">
            <li className="bg-gray-700 p-4 rounded-md">
              Deposited 10 AVAX on 01/03/2025
            </li>
            <li className="bg-gray-700 p-4 rounded-md">
              Deposited 5 AVAX on 15/03/2025
            </li>
            <li className="bg-gray-700 p-4 rounded-md">
              Withdrew 12 AVAX on 20/03/2025
            </li>
          </ul>
        </div>

        {/* Deposit Section */}
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Enter amount to deposit"
            className="w-full max-w-xs p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="bg-white text-black px-6 py-3 text-lg font-medium rounded-lg hover:bg-gray-300 transition">
            Deposit More
          </button>
        </div>

        {/* Withdraw Button */}
        <button className="bg-red-500 px-6 py-3 text-lg font-medium rounded-lg hover:bg-red-600 transition">
          Withdraw All
        </button>
      </main>

      {/* Footer */}
      <footer className="text-sm text-gray-500">
        &copy; 2025 AVAX Lending. All Rights Reserved.
      </footer>
    </div>
  );
}
