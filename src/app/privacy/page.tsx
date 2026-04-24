'use client';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md my-8">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 border-b pb-4">Privacy Policy</h1>
      <div className="space-y-6 text-gray-700 dark:text-neutral-300">
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Data Ownership & Transparency</h2>
          <p>
            At **Shift N Go**, your financial data is your business. This application is designed to be offline-first. 
            All accounting data, inventory logs, and balances stay on your local device unless Cloud Sync is explicitly enabled for secure team collaboration.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. Role-Based Data Isolation</h2>
          <p>
            We implement strict data compartmentalization. **Investors** are granted a restricted view of the dealership&apos;s financials. An Investor can only view transactions and vehicle records where they have been explicitly tagged as a stakeholder. Managers and Administrators maintain full oversight of the entire business audit trail.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">3. Information Collection</h2>
          <p>
            When Cloud Sync is enabled via Auth0, we store your Shift N Go account profile and dealership ledger securely. This data is encrypted and used solely for providing consistent access across your authorized devices. We never share your financial data with third parties.
          </p>
        </section>

        <section>
            <h2 className="text-2xl font-bold mb-3">4. Security Standards</h2>
            <p>
                We use industry-standard AES encryption and secure Auth0 authentication to ensure that only whitelisted users can access your dealership&apos;s command center.
            </p>
        </section>
      </div>
    </div>
  );
}



