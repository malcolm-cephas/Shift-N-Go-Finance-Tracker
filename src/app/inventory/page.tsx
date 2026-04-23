'use client';

import { InventoryManager } from '@/components/InventoryManager';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function InventoryPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'INVESTOR']}>
      <div className="py-8">
        <InventoryManager />
      </div>
    </ProtectedRoute>
  );
}
