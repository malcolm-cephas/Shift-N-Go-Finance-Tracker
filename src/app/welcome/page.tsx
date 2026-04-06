import Link from 'next/link';

const WelcomePage = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md dark:shadow-neutral-900/50 p-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📈</div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-neutral-100 mb-4 tracking-tight uppercase">Shift N Go Financial Intelligence</h1>
            <p className="text-xl text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Real-time financial tracking for pre-owned car dealerships. 
              Secure cloud-persistent data with role-based access for managers and investors.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="bg-neutral-50 dark:bg-neutral-700/30 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-12 mb-12 text-center shadow-xl">
            <div className="text-5xl mb-6">👔</div>
            <h2 className="text-3xl font-black text-gray-800 dark:text-neutral-100 uppercase tracking-tight">Enterprise Visibility</h2>
            <p className="text-gray-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
              Your financial data is securely synchronized across all your devices. 
              Admins and Managers can record transactions, while Investors have 
              read-only access to progress reports.
            </p>
          </div>

          {/* Getting Started Steps */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-neutral-200 mb-6 text-center">🚀 Getting Started in 3 Easy Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-neutral-50 dark:bg-neutral-800 dark:bg-brand-red/30 rounded-lg p-6 text-center">
                <div className="text-3xl mb-4">1️⃣</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Add Your Accounts</h3>
                <p className="text-gray-900 dark:text-white mb-4">
                  Create accounts for your assets (savings, investments), liabilities (loans, credit cards),
                  and equity to build your financial picture.
                </p>
                <Link
                  href="/add-account"
                  className="bg-brand-red hover:bg-brand-red-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-block"
                >
                  Add Account
                </Link>
              </div>

              {/* Step 2 */}
              <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6 text-center">
                <div className="text-3xl mb-4">2️⃣</div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">Record Balances</h3>
                <p className="text-green-700 dark:text-green-400 mb-4">
                  Enter current balances for all your accounts. You can update these regularly
                  to track your progress over time.
                </p>
                <Link
                  href="/record-balances"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-block"
                >
                  Record Balances
                </Link>
              </div>

              {/* Step 3 */}
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-6 text-center">
                <div className="text-3xl mb-4">3️⃣</div>
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">Track Progress</h3>
                <p className="text-purple-700 dark:text-purple-400 mb-4">
                  View your balance sheet and historical tracking to see your net worth
                  and financial progress over time.
                </p>
                <Link
                  href="/historical"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-block"
                >
                  View Tracking
                </Link>
              </div>
            </div>
          </section>

          {/* Features Overview */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-neutral-200 mb-6 text-center">✨ Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3 mt-1">📊</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-200">Balance Sheet View</h3>
                    <p className="text-gray-600 dark:text-neutral-400">See all your assets, liabilities, and net worth at a glance</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3 mt-1">📈</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-200">Historical Tracking</h3>
                    <p className="text-gray-600 dark:text-neutral-400">Track your financial progress with charts and trends over time</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3 mt-1">💰</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-200">Multiple Account Types</h3>
                    <p className="text-gray-600 dark:text-neutral-400">Support for various asset and liability categories</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3 mt-1">📤</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-200">Data Export/Import</h3>
                    <p className="text-gray-600 dark:text-neutral-400">Backup and restore your data with easy export/import tools</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3 mt-1">🔒</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-200">Secure Database</h3>
                    <p className="text-gray-600 dark:text-neutral-400">All data is backed up and persistent in your business database.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3 mt-1">📱</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-200">Mobile Friendly</h3>
                    <p className="text-gray-600 dark:text-neutral-400">Works perfectly on desktop, tablet, and mobile devices</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Account Categories Guide */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-neutral-200 mb-6 text-center">📝 Account Categories Guide</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">💚 Assets</h3>
                <p className="text-green-700 dark:text-green-400 text-sm mb-3">Things you own that have value:</p>
                <ul className="text-green-700 dark:text-green-400 text-sm space-y-1">
                  <li>• Cash & Savings Accounts</li>
                  <li>• Investment Accounts</li>
                  <li>• Real Estate</li>
                  <li>• Personal Property</li>
                  <li>• Retirement Accounts</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3">❤️ Liabilities</h3>
                <p className="text-red-700 dark:text-red-400 text-sm mb-3">Money you owe to others:</p>
                <ul className="text-red-700 dark:text-red-400 text-sm space-y-1">
                  <li>• Credit Card Debt</li>
                  <li>• Student Loans</li>
                  <li>• Car Loans</li>
                  <li>• Mortgages</li>
                  <li>• Personal Loans</li>
                </ul>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-800 dark:bg-brand-red/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">💙 Equity</h3>
                <p className="text-gray-900 dark:text-white text-sm mb-3">Your net worth calculation:</p>
                <ul className="text-gray-900 dark:text-white text-sm space-y-1">
                  <li>• Total Assets minus Liabilities</li>
                  <li>• Automatically calculated</li>
                  <li>• Track wealth building progress</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Operating Notes */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-neutral-200 mb-6 text-center">💡 Operating Notes</h2>
            <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-8">
              <ul className="space-y-4 text-gray-700 dark:text-neutral-300">
                <li className="flex items-center">
                  <span className="text-2xl mr-4">☁️</span>
                  <span><strong>Automatic Sync:</strong> Your financial updates are saved instantly to the secure database.</span>
                </li>
                <li className="flex items-center">
                  <span className="text-2xl mr-4">🛡️</span>
                  <span><strong>Role Protection:</strong> Investors can only view reports, preventing accidental data modification.</span>
                </li>
                <li className="flex items-center">
                  <span className="text-2xl mr-4">🎯</span>
                  <span><strong>Data Accuracy:</strong> Managers should ensure balances match physical inventory for accurate investor reports.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-neutral-700">
            <Link
              href="/add-account"
              className="bg-brand-red hover:bg-brand-red-dark text-white px-6 py-3 rounded-md font-medium transition-colors text-center flex-1"
            >
              🚀 Start by Adding an Account
            </Link>
            <Link
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium transition-colors text-center"
            >
              📊 View Balance Sheet
            </Link>
            <Link
              href="/disclaimer"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors text-center"
            >
              📋 Read Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;



