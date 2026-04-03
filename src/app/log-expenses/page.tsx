'use client';

import { LogTransactions } from '@/components/LogTransactions';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function LogExpensesPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
      <div>
        <LogTransactions />
      </div>
    </ProtectedRoute>
  );
}



