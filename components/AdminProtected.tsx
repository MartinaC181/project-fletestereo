'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminProtectedProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const AdminProtected: React.FC<AdminProtectedProps> = ({ 
  children, 
  redirectTo = '/dashboard' 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = sessionStorage.getItem('adminAuth') === 'true';
      
      if (!isLoggedIn) {
        router.push(redirectTo);
        return;
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // El redirect ya se ejecutó
  }

  return <>{children}</>;
};

// Hook para verificar autenticación
export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = sessionStorage.getItem('adminAuth') === 'true';
      setIsAuthenticated(isLoggedIn);
      setIsLoading(false);
    };

    checkAuth();

    // Escuchar cambios en el sessionStorage
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = () => {
    sessionStorage.setItem('adminAuth', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};