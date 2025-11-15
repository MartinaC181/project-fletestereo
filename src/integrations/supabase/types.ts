export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          actor: string | null
          cambio_json: Json | null
          created_at: string
          entidad: string
          entidad_id: string
          id: string
        }
        Insert: {
          actor?: string | null
          cambio_json?: Json | null
          created_at?: string
          entidad: string
          entidad_id: string
          id?: string
        }
        Update: {
          actor?: string | null
          cambio_json?: Json | null
          created_at?: string
          entidad?: string
          entidad_id?: string
          id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          apellido: string | null
          created_at: string
          dni: string | null
          email: string | null
          id: string
          nombre: string
          role: Database['public']['Enums']['user_role'] | null
          telefono: string
          updated_at: string
        }
        Insert: {
          apellido?: string | null
          created_at?: string
          dni?: string | null
          email?: string | null
          id?: string
          nombre: string
          role?: Database['public']['Enums']['user_role'] | null
          telefono: string
          updated_at?: string
        }
        Update: {
          apellido?: string | null
          created_at?: string
          dni?: string | null
          email?: string | null
          es_temporal?: boolean | null
          id?: string
          nombre?: string
          role?: Database['public']['Enums']['user_role'] | null
          telefono?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          id: string
          permissions: Json | null
          last_login: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          permissions?: Json | null
          last_login?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          permissions?: Json | null
          last_login?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_id_fkey"
            columns: ["id"]
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_users_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      config: {
        Row: {
          created_at: string
          extras_json: Json | null
          id: string
          plantillas_json: Json | null
          politicas_md: string | null
          porcentaje_senia: number | null
          precio_km: number | null
          tarifa_base: number | null
          umbral_km: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          extras_json?: Json | null
          id?: string
          plantillas_json?: Json | null
          politicas_md?: string | null
          porcentaje_senia?: number | null
          precio_km?: number | null
          tarifa_base?: number | null
          umbral_km?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          extras_json?: Json | null
          id?: string
          plantillas_json?: Json | null
          politicas_md?: string | null
          porcentaje_senia?: number | null
          precio_km?: number | null
          tarifa_base?: number | null
          umbral_km?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          activo: boolean | null
          created_at: string
          id: string
          nombre: string
          telefono: string
        }
        Insert: {
          activo?: boolean | null
          created_at?: string
          id?: string
          nombre: string
          telefono: string
        }
        Update: {
          activo?: boolean | null
          created_at?: string
          id?: string
          nombre?: string
          telefono?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          canal: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          enviado_ts: string | null
          estado: string
          id: string
          payload_json: Json | null
          plantilla: string
          request_id: string | null
        }
        Insert: {
          canal: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          enviado_ts?: string | null
          estado?: string
          id?: string
          payload_json?: Json | null
          plantilla: string
          request_id?: string | null
        }
        Update: {
          canal?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          enviado_ts?: string | null
          estado?: string
          id?: string
          payload_json?: Json | null
          plantilla?: string
          request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          created_at: string
          id: string
          moneda: string | null
          monto: number
          payment_id: string | null
          provider: string
          request_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          moneda?: string | null
          monto: number
          payment_id?: string | null
          provider: string
          request_id?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          moneda?: string | null
          monto?: number
          payment_id?: string | null
          provider?: string
          request_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          created_at: string
          extras_json: Json | null
          id: string
          km: number | null
          precio_km: number
          request_id: string | null
          tarifa_base: number
          total: number
        }
        Insert: {
          created_at?: string
          extras_json?: Json | null
          id?: string
          km?: number | null
          precio_km: number
          request_id?: string | null
          tarifa_base: number
          total: number
        }
        Update: {
          created_at?: string
          extras_json?: Json | null
          id?: string
          km?: number | null
          precio_km?: number
          request_id?: string | null
          tarifa_base?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          carga_tipo: string
          carga_volumen: string | null
          client_id: string | null
          created_at: string
          destino: string
          estado: Database["public"]["Enums"]["request_status"] | null
          fecha: string
          franja: string
          id: string
          km: number | null
          notas: string | null
          origen: string
          precio_km: number | null
          tarifa_base: number | null
          total: number | null
          extras_json: Json | null
          updated_at: string
        }
        Insert: {
          carga_tipo: string
          carga_volumen?: string | null
          client_id?: string | null
          created_at?: string
          destino: string
          estado?: Database["public"]["Enums"]["request_status"] | null
          fecha: string
          franja: string
          id?: string
          km?: number | null
          notas?: string | null
          origen: string
          precio_km?: number | null
          tarifa_base?: number | null
          total?: number | null
          extras_json?: Json | null
          updated_at?: string
        }
        Update: {
          carga_tipo?: string
          carga_volumen?: string | null
          client_id?: string | null
          created_at?: string
          destino?: string
          estado?: Database["public"]["Enums"]["request_status"] | null
          fecha?: string
          franja?: string
          id?: string
          km?: number | null
          notas?: string | null
          origen?: string
          precio_km?: number | null
          tarifa_base?: number | null
          total?: number | null
          extras_json?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule: {
        Row: {
          bloqueado: boolean | null
          chofer_id: string | null
          created_at: string
          fin_ts: string
          id: string
          inicio_ts: string
          request_id: string | null
          vehiculo_id: string | null
        }
        Insert: {
          bloqueado?: boolean | null
          chofer_id?: string | null
          created_at?: string
          fin_ts: string
          id?: string
          inicio_ts: string
          request_id?: string | null
          vehiculo_id?: string | null
        }
        Update: {
          bloqueado?: boolean | null
          chofer_id?: string | null
          created_at?: string
          fin_ts?: string
          id?: string
          inicio_ts?: string
          request_id?: string | null
          vehiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_chofer_id_fkey"
            columns: ["chofer_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          activo: boolean | null
          capacidad: string
          created_at: string
          id: string
          patente: string
        }
        Insert: {
          activo?: boolean | null
          capacidad: string
          created_at?: string
          id?: string
          patente: string
        }
        Update: {
          activo?: boolean | null
          capacidad?: string
          created_at?: string
          id?: string
          patente?: string
        }
        Relationships: []
      }
      freight_history: {
        Row: {
          id: string
          client_id: string
          request_id: string | null
          fecha_flete: string
          origen: string
          destino: string
          peso: number | null
          volumen: number | null
          precio: number
          estado: string
          observaciones: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          request_id?: string | null
          fecha_flete: string
          origen: string
          destino: string
          peso?: number | null
          volumen?: number | null
          precio: number
          estado?: string
          observaciones?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          request_id?: string | null
          fecha_flete?: string
          origen?: string
          destino?: string
          peso?: number | null
          volumen?: number | null
          precio?: number
          estado?: string
          observaciones?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "freight_history_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_history_request_id_fkey"
            columns: ["request_id"]
            referencedRelation: "requests"
            referencedColumns: ["id"]
          }
        ]
      }
      zones: {
        Row: {
          created_at: string
          geo_json: Json | null
          id: string
          nombre: string
        }
        Insert: {
          created_at?: string
          geo_json?: Json | null
          id?: string
          nombre: string
        }
        Update: {
          created_at?: string
          geo_json?: Json | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          nombre: string
          descripcion: string
          caracteristicas: string[]
          precio: string
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion: string
          caracteristicas: string[]
          precio: string
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string
          caracteristicas?: string[]
          precio?: string
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      create_admin_user: {
        Args: {
          user_id: string
          user_email: string
          user_name?: string
          user_lastname?: string
          user_phone?: string
        }
        Returns: boolean
      }
      delete_service: {
        Args: {
          service_id: string
        }
        Returns: void
      }
    }
    Enums: {
      notification_channel: "email" | "whatsapp"
      request_status:
        | "Solicitada"
        | "Señada"
        | "Confirmada"
        | "Rechazada"
        | "Completada"
        | "Cancelada"
      user_role: "admin" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      notification_channel: ["email", "whatsapp"],
      request_status: [
        "Solicitada",
        "Señada",
        "Confirmada",
        "Rechazada",
        "Completada",
        "Cancelada",
      ],
    },
  },
} as const
