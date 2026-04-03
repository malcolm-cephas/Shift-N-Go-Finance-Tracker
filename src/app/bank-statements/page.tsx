'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { BankStatementUpload } from '@/components/BankStatementUpload';

export default function BankStatementsPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
      <BankStatementUpload />
    </ProtectedRoute>
  );
}


