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

        {/* Role Recognition Banner */}
        <div className="bg-neutral-50 dark:bg-neutral-700/30 border border-neutral-200 dark:border-neutral-600 rounded-3xl p-8 mb-12 text-center shadow-sm">
          <div className="text-4xl mb-4">🏦</div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-neutral-100 uppercase tracking-tight">Enterprise Financial Management</h2>
          <p className="text-gray-600 dark:text-neutral-400 mt-2 max-w-xl mx-auto leading-relaxed">
            Role-based access ensures your data is handled securely. Managers can record operations 
            while investors receive real-time performance insights.
          </p>
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



