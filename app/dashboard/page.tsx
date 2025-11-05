'use client';

import { AdminProtected } from '@/components/AdminProtected';
import { OwnerDashboard } from '@/components/OwnerDashboard';

export default function DashboardPage() {
  return (
    <AdminProtected requireAdmin={true}>
      <OwnerDashboard />
    </AdminProtected>
  );
}