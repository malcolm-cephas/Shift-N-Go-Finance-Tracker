'use client';

import Link from 'next/link';

const WelcomeScreen = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg dark:shadow-neutral-900/50 p-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="h-2 w-20 bg-brand-red mx-auto mb-6 rounded-full"></div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Welcome to <span className="text-brand-red">Shift N Go</span>!
          </h1>
          <p className="text-lg text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            The professional dashboard for pre-owned car dealers. 
            Track inventory performance and maintain investor-ready financial records.
          </p>
        </div>

        {/* Privacy Banner */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-6 mb-8">
          <div className="flex items-center justify-center">
            <div className="flex-shrink-0">
              <span className="text-2xl mr-3 font-bold text-green-600">Secure</span>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-medium text-green-800 dark:text-green-300">100% Private & Secure</h2>
              <p className="mt-1 text-green-700 dark:text-green-400">
                Your financial data stays on your device. No servers, no accounts, no data sharing.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Start Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Step 1 */}
          <div className="bg-neutral-50 dark:bg-neutral-800 dark:bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-black text-brand-red mb-4">1</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Add Accounts</h3>
            <p className="text-gray-900 dark:text-white mb-4 text-sm">
              Create accounts for your assets, liabilities, and equity.
            </p>
            <Link
              href="/add-account"
              className="bg-brand-red hover:bg-brand-red-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-block"
            >
              Add Your First Account
            </Link>
          </div>

          {/* Step 2 */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-black text-brand-red mb-4">2</div>
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">Record Balances</h3>
            <p className="text-green-700 dark:text-green-400 mb-4 text-sm">
              Enter current balances for tracking over time.
            </p>
            <Link
              href="/record-balances"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-block"
            >
              Record Balances
            </Link>
          </div>

          {/* Step 3 */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-black text-brand-red mb-4">3</div>
            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">Track Progress</h3>
            <p className="text-purple-700 dark:text-purple-400 mb-4 text-sm">
              View charts and track your business net value over time.
            </p>
            <Link
              href="/historical"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-block"
            >
              View Tracking
            </Link>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-gray-50 dark:bg-neutral-700/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-100 mb-4 text-center uppercase tracking-wider">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-neutral-300">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="mr-3 text-brand-red font-bold">✓</span>
                <span>Complete balance sheet view</span>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-brand-red font-bold">✓</span>
                <span>Historical progress tracking</span>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-brand-red font-bold">✓</span>
                <span>Multiple account categories</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="mr-3 text-brand-red font-bold">✓</span>
                <span>Complete privacy & security</span>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-brand-red font-bold">✓</span>
                <span>Easy data export/import</span>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-brand-red font-bold">✓</span>
                <span>Mobile-friendly design</span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-8">
          <div className="flex items-start">
            <span className="text-lg mr-2 font-bold text-yellow-600">Info:</span>
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Important:</h3>
              <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                All your data is stored locally in this browser. Make sure to export your data regularly
                from the Settings page to prevent data loss if you clear your browser data.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/add-account"
            className="bg-brand-red hover:bg-brand-red-dark text-white px-6 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] text-center flex-1 shadow-lg shadow-red-600/20"
          >
            START DEALING NOW
          </Link>
          <Link
            href="/disclaimer"
            className="bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white px-6 py-4 rounded-xl font-bold transition-all hover:bg-gray-200 dark:hover:bg-neutral-600 text-center"
          >
            PRIVACY INFO
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;



