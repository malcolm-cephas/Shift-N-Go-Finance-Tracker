'use client';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md my-8">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 border-b pb-4">Privacy Policy</h1>
      <div className="space-y-6 text-gray-700 dark:text-neutral-300">
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Data Ownership</h2>
          <p>
            At **Shift N Go**, your financial data is your business. This application is designed to be offline-first. 
            Unless you explicitly enable Cloud Sync, all your accounting data, inventory logs, and balances stay on your local device.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. Information Collection</h2>
          <p>
            If you enable Cloud Sync via Auth0, we store your Shift N Go account info (ID, accounts, and balances) securely in our database to ensure consistency across your devices. 
            We do not share this data with third parties.
          </p>
        </section>

        <section>
            <h2 className="text-2xl font-bold mb-3">4. Security</h2>
            <p>
                We use industry-standard encryption for all data processed by Shift N Go.
            </p>
        </section>
      </div>
    </div>
  );
}



