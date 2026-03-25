'use client';

import { InvestorOverview } from '@/components/InvestorOverview';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function InvestorDashboardPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto py-8">
        <InvestorOverview />
      </div>
    </ProtectedRoute>
  );
}



