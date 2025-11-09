/**
 * Tipos para el módulo de Servicios
 */

export interface Service {
  id: string;
  nombre: string;
  descripcion: string;
  caracteristicas: string[];
  precio: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}
