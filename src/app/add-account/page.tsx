'use client';

import { AddAccountForm } from '@/components/AddAccountForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AddAccountPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg dark:shadow-neutral-900/50 p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-200 mb-2">Add Business Unit</h1>
            <p className="text-gray-600 dark:text-neutral-400">Create a new business unit, bank account, or department to track in your financial overview</p>
          </div>
          <AddAccountForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}



