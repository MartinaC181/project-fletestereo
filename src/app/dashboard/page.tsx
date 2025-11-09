'use client';

import { AdminProtected } from '@/src/components/AdminProtected';
import { OwnerDashboard } from '@/src/components/OwnerDashboard';
import Header from '@/src/components/Header';

export default function DashboardPage() {
  return (
    <AdminProtected requireAdmin={true}>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <OwnerDashboard />
        </main>
      </div>
    </AdminProtected>
  );
}