'use client';

import { AdminProtected } from '@/components/AdminProtected';
import { OwnerDashboard } from '@/components/OwnerDashboard';
import Header from '@/components/Header';

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