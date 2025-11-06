/**
 * Servicio para gestión de Servicios
 */

import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types/service';

export class ServicesService {
  /**
   * Obtener todos los servicios activos
   */
  async getActiveServices(): Promise<Service[]> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('activo', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error obteniendo servicios:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error en getActiveServices:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los servicios (incluidos inactivos) - Solo Admin
   */
  async getAllServices(): Promise<Service[]> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error obteniendo todos los servicios:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error en getAllServices:', error);
      throw error;
    }
  }

  /**
   * Obtener un servicio por ID
   */
  async getServiceById(id: string): Promise<Service | null> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error obteniendo servicio:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error en getServiceById:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo servicio - Solo Admin
   */
  async createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([service])
        .select()
        .single();

      if (error) {
        console.error('Error creando servicio:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error en createService:', error);
      throw error;
    }
  }

  /**
   * Actualizar un servicio existente - Solo Admin
   */
  async updateService(id: string, updates: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>): Promise<Service> {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error actualizando servicio:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error en updateService:', error);
      throw error;
    }
  }

  /**
   * Eliminar un servicio (soft delete) - Solo Admin
   */
  async deleteService(id: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('delete_service', {
        service_id: id
      });

      if (error) {
        console.error('Error eliminando servicio:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error en deleteService:', error);
      throw error;
    }
  }

  /**
   * Restaurar un servicio eliminado - Solo Admin
   */
  async restoreService(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('services')
        .update({ activo: true })
        .eq('id', id);

      if (error) {
        console.error('Error restaurando servicio:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error en restoreService:', error);
      throw error;
    }
  }
}

// Exportar instancia única
export const servicesService = new ServicesService();
