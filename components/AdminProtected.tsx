'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AdminProtectedProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAdmin?: boolean;
}

export const AdminProtected: React.FC<AdminProtectedProps> = ({ 
  children, 
  redirectTo = '/login',
  requireAdmin = false
}) => {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Si no hay usuario, redirigir al login
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Si se requiere admin y el usuario no es admin
      if (requireAdmin && !isAdmin) {
        router.push('/?error=access_denied');
        return;
      }
    }
  }, [user, loading, isAdmin, requireAdmin, router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin)) {
    return null; // El redirect ya se ejecutó
  }

  return <>{children}</>;
};

// Hook para verificar autenticación (deprecated, usar useAuth en su lugar)
export const useAdminAuth = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  
  return {
    isAuthenticated: !!user,
    isLoading: loading,
    isAdmin,
    login: () => {}, // Deprecated
    logout: signOut
  };
};