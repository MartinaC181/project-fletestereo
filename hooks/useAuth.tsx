'use client';

import { useState, useEffect, useContext, createContext, type ReactNode } from 'react';
import { AuthService, type AuthUser } from '@/lib/services/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (credentials: {
    email: string;
    password: string;
    nombre: string;
    apellido?: string;
    telefono?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const session = await AuthService.getSession();
        setUser(session?.user || null);
        
        if (session?.user) {
          const adminStatus = await AuthService.isAdmin();
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('Error al obtener sesión inicial:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = AuthService.onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        const adminStatus = await AuthService.isAdmin();
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await AuthService.signIn({ email, password });
      
      if (result.success && result.user) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.error?.message || 'Error al iniciar sesión' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Error inesperado al iniciar sesión' 
      };
    }
  };

  const signUp = async (credentials: {
    email: string;
    password: string;
    nombre: string;
    apellido?: string;
    telefono?: string;
  }) => {
    try {
      const result = await AuthService.signUp(credentials);
      
      if (result.success) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.error?.message || 'Error al registrarse' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Error inesperado al registrarse' 
      };
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      // El estado se actualizará automáticamente por el listener
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await AuthService.resetPassword(email);
      
      if (!error) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: error.message || 'Error al enviar email de recuperación' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Error inesperado al enviar email de recuperación' 
      };
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}