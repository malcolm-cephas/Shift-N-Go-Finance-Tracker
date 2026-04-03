'use client';

import { HistoricalTracking } from '@/components/HistoricalTracking';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function HistoricalPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'INVESTOR']}>
      <div>
        <HistoricalTracking />
      </div>
    </ProtectedRoute>
  );
}



