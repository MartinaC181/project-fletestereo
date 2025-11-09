// Script para crear usuario admin
// Ejecutar desde la consola del navegador o como función

import { supabase } from '@/integrations/supabase/client';

export async function createAdminUser(email?: string, password?: string, adminData?: {
  nombre?: string;
  apellido?: string;
  telefono?: string;
}) {
  try {
    const adminEmail = email || 'admin@fletestereo.com';
    const adminPassword = password || 'fletestereo2024';
    const nombre = adminData?.nombre || 'Administrador';
    const apellido = adminData?.apellido || 'Sistema';
    const telefono = adminData?.telefono || '379-000-0000';

    console.log('Creando usuario administrador...');

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          nombre,
          apellido,
          role: 'admin'
        }
      }
    });

    if (authError) {
      console.error('Error creando usuario auth:', authError);
      return { success: false, error: authError };
    }

    if (!authData.user) {
      console.error('No se creó el usuario');
      return { success: false, error: 'No user created' };
    }

    console.log('Usuario auth creado:', authData.user.id);

    // 2. Usar la función de base de datos para crear el admin
    const { data: adminResult, error: adminError } = await supabase
      .rpc('create_admin_user', {
        user_id: authData.user.id,
        user_email: adminEmail,
        user_name: nombre,
        user_lastname: apellido,
        user_phone: telefono
      });

    if (adminError) {
      console.error('Error creando admin:', adminError);
      return { success: false, error: adminError };
    }

    if (!adminResult) {
      console.error('La función create_admin_user retornó false');
      return { success: false, error: 'Failed to create admin user' };
    }

    console.log('Admin creado exitosamente usando función de BD');

    return {
      success: true,
      data: {
        user: authData.user,
        adminCreated: adminResult
      }
    };

  } catch (error) {
    console.error('Error general:', error);
    return { success: false, error };
  }
}

// Función para crear admin desde consola del navegador
export async function createDefaultAdmin() {
  const result = await createAdminUser();
  if (result.success) {
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('📧 Email:', 'admin@fletestereo.com');
    console.log('🔑 Password:', 'fletestereo2024');
    console.log('⚠️  Cambia la contraseña después del primer login');
  } else {
    console.error('❌ Error creando administrador:', result.error);
  }
  return result;
}

// Para usar desde la consola del navegador:
// 1. Importar este archivo
// 2. Ejecutar: createDefaultAdmin()
// 
// O crear admin personalizado:
// createAdminUser('miemail@example.com', 'mipassword', {
//   nombre: 'Mi Nombre',
//   apellido: 'Mi Apellido', 
//   telefono: '379-123-4567'
// });