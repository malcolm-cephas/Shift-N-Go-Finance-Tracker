'use client';

import { RecordBalances } from '@/components/RecordBalances';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function RecordBalancesPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'INVESTOR']}>
      <div>
        <RecordBalances />
      </div>
    </ProtectedRoute>
  );
}



