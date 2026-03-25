'use client';

import { LogTransactions } from '@/components/LogTransactions';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function LogExpensesPage() {
  return (
    <ProtectedRoute>
      <div>
        <LogTransactions />
      </div>
    </ProtectedRoute>
  );
}



