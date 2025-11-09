import { supabase } from '@/integrations/supabase/client';
import type { User, AuthError } from '@supabase/supabase-js';

export type AuthUser = User;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  nombre: string;
  apellido?: string;
  telefono?: string;
}

export interface AuthResponse {
  user?: AuthUser | null;
  error?: AuthError | null;
  success: boolean;
}

export class AuthService {
  /**
   * Inicia sesión con email y contraseña
   */
  static async signIn({ email, password }: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('[AuthService] Error al iniciar sesión:', error);
        return { error, success: false };
      }

      return { user: data.user, success: true };
    } catch (error) {
      console.error('[AuthService] Error inesperado al iniciar sesión:', error);
      return { 
        error: error as AuthError, 
        success: false 
      };
    }
  }

  /**
   * Registra un nuevo usuario
   */
  static async signUp({ email, password, nombre, apellido, telefono }: SignUpCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            nombre,
            apellido,
            telefono,
          }
        }
      });

      if (error) {
        console.error('[AuthService] Error al registrarse:', error);
        return { error, success: false };
      }

      // Si el usuario se crea correctamente, también crear el registro en la tabla clients
      if (data.user) {
        const { error: clientError } = await supabase
          .from('clients')
          .insert({
            id: data.user.id,
            nombre,
            apellido: apellido || null,
            telefono: telefono || '000-000-0000', // Valor por defecto ya que es NOT NULL
            email: email.trim().toLowerCase(),
          });

        if (clientError) {
          console.error('[AuthService] Error al crear cliente:', clientError);
          // No retornamos error aquí porque el usuario ya fue creado
        }
      }

      return { user: data.user, success: true };
    } catch (error) {
      console.error('[AuthService] Error inesperado al registrarse:', error);
      return { 
        error: error as AuthError, 
        success: false 
      };
    }
  }

  /**
   * Cierra la sesión del usuario actual
   */
  static async signOut(): Promise<{ error?: AuthError }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[AuthService] Error al cerrar sesión:', error);
      }
      return { error: error || undefined };
    } catch (error) {
      console.error('[AuthService] Error inesperado al cerrar sesión:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Obtiene el usuario actual
   */
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('[AuthService] Error al obtener usuario actual:', error);
      return null;
    }
  }

  /**
   * Obtiene la sesión actual
   */
  static async getSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('[AuthService] Error al obtener sesión:', error);
      return null;
    }
  }

  /**
   * Verifica si el usuario actual es administrador
   */
  static async isAdmin(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      if (!user) return false;

      // Verificar en la tabla clients si tiene rol admin
      const { data, error } = await supabase
        .from('clients')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('[AuthService] Error al verificar rol admin:', error);
        // Fallback: verificar email admin por defecto
        return user.email === 'admin@fletestereo.com' || 
               user.user_metadata?.role === 'admin';
      }

      return data?.role === 'admin';
    } catch (error) {
      console.error('[AuthService] Error al verificar admin:', error);
      return false;
    }
  }

  /**
   * Obtiene el rol del usuario actual
   */
  static async getUserRole(): Promise<'admin' | 'client' | null> {
    try {
      const user = await this.getCurrentUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('clients')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('[AuthService] Error al obtener rol:', error);
        return null;
      }

      return data?.role || 'client';
    } catch (error) {
      console.error('[AuthService] Error al obtener rol:', error);
      return null;
    }
  }

  /**
   * Escucha cambios en el estado de autenticación
   */
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  }

  /**
   * Envía email de recuperación de contraseña
   */
  static async resetPassword(email: string): Promise<{ error?: AuthError }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      return { error: error || undefined };
    } catch (error) {
      console.error('[AuthService] Error al enviar reset password:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Actualiza la contraseña del usuario
   */
  static async updatePassword(password: string): Promise<{ error?: AuthError }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      return { error: error || undefined };
    } catch (error) {
      console.error('[AuthService] Error al actualizar contraseña:', error);
      return { error: error as AuthError };
    }
  }
}