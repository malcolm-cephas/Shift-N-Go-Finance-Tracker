'use client';

import { InvestorOverview } from '@/components/InvestorOverview';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function InvestorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'INVESTOR']}>
      <div className="max-w-6xl mx-auto py-8">
        <InvestorOverview />
      </div>
    </ProtectedRoute>
  );
}



