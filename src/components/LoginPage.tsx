'use client';

import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md dark:shadow-neutral-900/50 p-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="h-1 w-24 bg-brand-red mx-auto mb-8 rounded-full"></div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Welcome to <span className="text-brand-red">Shift N Go</span></h1>
            <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              The premium dashboard for pre-owned car dealers. 
              Track inventory, manage expenses, and generate investor-ready reports with absolute privacy.
            </p>
          </div>

          {/* Privacy Banner */}
          <div className="rounded-md shadow my-5">
              <a
                href="/auth/login?screen_hint=signup"
                className="group relative w-full flex justify-center py-5 px-6 border border-transparent text-lg font-bold rounded-xl text-white bg-brand-red hover:bg-brand-red-dark focus:outline-none focus:ring-4 focus:ring-brand-red/50 transition-all transform hover:scale-[1.01] shadow-xl shadow-red-600/30"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-4 transition-transform group-hover:scale-110">
                  <span className="text-sm font-bold opacity-50 px-2 py-0.5 border border-white/30 rounded">SECURE</span>
                </span>
                SIGN IN TO DASHBOARD
              </a>
          </div>
          {/* Getting Started Steps */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-neutral-100 mb-6 text-center uppercase tracking-tight">Getting Started in 3 Easy Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-neutral-50 dark:bg-neutral-800 dark:bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 text-center">
                <div className="text-3xl font-black text-brand-red mb-4">1</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Add Your Accounts</h3>
                <p className="text-gray-900 dark:text-white mb-4">
                  Create accounts for your assets (savings, investments), liabilities (loans, credit cards),
                  and equity to build your financial picture.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center">
                <div className="text-3xl font-black text-brand-red mb-4">2</div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">Record Balances</h3>
                <p className="text-green-700 dark:text-green-400 mb-4">
                  Enter current balances for all your accounts. You can update these regularly
                  to track your progress over time.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center">
                <div className="text-3xl font-black text-brand-red mb-4">3</div>
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">Track Progress</h3>
                <p className="text-purple-700 dark:text-purple-400 mb-4">
                  View your balance sheet and historical tracking to see your net worth
                  and financial progress over time.
                </p>
              </div>
            </div>
          </section>

          {/* Features Overview */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-neutral-100 mb-6 text-center uppercase tracking-tight">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-brand-red font-bold mr-3 mt-1 text-xl">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-100">Balance Sheet View</h3>
                    <p className="text-gray-600 dark:text-neutral-400">See all your assets, liabilities, and net worth at a glance</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-brand-red font-bold mr-3 mt-1 text-xl">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-100">Historical Tracking</h3>
                    <p className="text-gray-600 dark:text-neutral-400">Track your financial progress with charts and trends over time</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-brand-red font-bold mr-3 mt-1 text-xl">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-100">Multiple Account Types</h3>
                    <p className="text-gray-600 dark:text-neutral-400">Support for various asset and liability categories</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-brand-red font-bold mr-3 mt-1 text-xl">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-100">Data Export/Import</h3>
                    <p className="text-gray-600 dark:text-neutral-400">Backup and restore your data with easy export/import tools</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-brand-red font-bold mr-3 mt-1 text-xl">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-100">Complete Privacy</h3>
                    <p className="text-gray-600 dark:text-neutral-400">All data stored locally - no servers, no tracking, no accounts</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-brand-red font-bold mr-3 mt-1 text-xl">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-100">Mobile Friendly</h3>
                    <p className="text-gray-600 dark:text-neutral-400">Works perfectly on desktop, tablet, and mobile devices</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Account Categories Guide */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-neutral-100 mb-6 text-center uppercase tracking-tight">Account Categories Guide</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3 uppercase tracking-wider">Assets</h3>
                <p className="text-green-700 dark:text-green-400 text-sm mb-3">Things you own that have value:</p>
                <ul className="text-green-700 dark:text-green-400 text-sm space-y-1">
                  <li>• Cash & Savings Accounts</li>
                  <li>• Investment Accounts</li>
                  <li>• Real Estate</li>
                  <li>• Personal Property</li>
                  <li>• Retirement Accounts</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3 uppercase tracking-wider">Liabilities</h3>
                <p className="text-red-700 dark:text-red-400 text-sm mb-3">Money you owe to others:</p>
                <ul className="text-red-700 dark:text-red-400 text-sm space-y-1">
                  <li>• Credit Card Debt</li>
                  <li>• Student Loans</li>
                  <li>• Car Loans</li>
                  <li>• Mortgages</li>
                  <li>• Personal Loans</li>
                </ul>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-800 dark:bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Equity</h3>
                <p className="text-gray-900 dark:text-white text-sm mb-3">Your net worth calculation:</p>
                <ul className="text-gray-900 dark:text-white text-sm space-y-1">
                  <li>• Total Assets minus Liabilities</li>
                  <li>• Automatically calculated</li>
                  <li>• Track wealth building progress</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Important Tips */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-neutral-100 mb-6 text-center uppercase tracking-tight">Important Tips</h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-6">
              <ul className="space-y-3 text-yellow-800 dark:text-yellow-300">
                <li className="flex items-start">
                  <span className="font-bold mr-3 text-yellow-600">•</span>
                  <span><strong>Regular Backups:</strong> Export your data regularly using the Settings page to prevent data loss.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-3 text-yellow-600">•</span>
                  <span><strong>Update Regularly:</strong> Record new balances monthly or quarterly to track your progress.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-3 text-yellow-600">•</span>
                  <span><strong>Be Accurate:</strong> Use actual account balances for the most useful financial picture.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-3 text-yellow-600">•</span>
                  <span><strong>Browser Specific:</strong> Data is tied to this specific browser - bookmark this site!</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-neutral-700">
            <Link
              href="/disclaimer"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors text-center"
            >
              Read Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;



