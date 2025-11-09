'use client';

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';

export function LoginRedirect() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Si el usuario está autenticado, redirigir según su rol
      if (isAdmin) {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [user, isAdmin, loading, router]);

  return null;
}