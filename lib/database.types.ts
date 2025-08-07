export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      alpha: {
        Row: {
          address: string
          created_at: string
          id: number
          text: string | null
          text_en: string | null
          title: string | null
          title_en: string | null
        }
        Insert: {
          address: string
          created_at?: string
          id?: number
          text?: string | null
          text_en?: string | null
          title?: string | null
          title_en?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          id?: number
          text?: string | null
          text_en?: string | null
          title?: string | null
          title_en?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alpha_address_fkey"
            columns: ["address"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["address"]
          },
        ]
      }
      flywheels: {
        Row: {
          address: string
          image: string | null
        }
        Insert: {
          address: string
          image?: string | null
        }
        Update: {
          address?: string
          image?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flywheels_address_fkey"
            columns: ["address"]
            isOneToOne: true
            referencedRelation: "tokens"
            referencedColumns: ["address"]
          },
          {
            foreignKeyName: "flywheels_address_fkey1"
            columns: ["address"]
            isOneToOne: true
            referencedRelation: "tokens"
            referencedColumns: ["address"]
          },
        ]
      }
      logs: {
        Row: {
          created_at: string
          id: string
          message: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          created_at: string
          expired_at: string | null
          id: number
          solana_address: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          expired_at?: string | null
          id?: number
          solana_address?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          expired_at?: string | null
          id?: number
          solana_address?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      metrics_dynamic: {
        Row: {
          address: string
          created_at: string
          id: string
          label: string
          label_en: string | null
          ordering: number | null
          source: string | null
          unit: string | null
          unit_en: string | null
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          label: string
          label_en?: string | null
          ordering?: number | null
          source?: string | null
          unit?: string | null
          unit_en?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          label?: string
          label_en?: string | null
          ordering?: number | null
          source?: string | null
          unit?: string | null
          unit_en?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metric_dynamic_address_fkey"
            columns: ["address"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["address"]
          },
        ]
      }
      metrics_dynamic_values: {
        Row: {
          id: string
          metric_id: string
          time: string
          value: number
        }
        Insert: {
          id?: string
          metric_id?: string
          time?: string
          value: number
        }
        Update: {
          id?: string
          metric_id?: string
          time?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "metrics_dymicvalues_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "metrics_dynamic"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics_static: {
        Row: {
          address: string
          created_at: string
          description: string | null
          description_en: string | null
          id: number
          label: string
          label_en: string | null
          ordering: number | null
          source: string | null
          updated_at: string
          value: string
          value_en: string | null
        }
        Insert: {
          address: string
          created_at?: string
          description?: string | null
          description_en?: string | null
          id?: number
          label: string
          label_en?: string | null
          ordering?: number | null
          source?: string | null
          updated_at?: string
          value: string
          value_en?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          description?: string | null
          description_en?: string | null
          id?: number
          label?: string
          label_en?: string | null
          ordering?: number | null
          source?: string | null
          updated_at?: string
          value?: string
          value_en?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metrics_static_address_fkey"
            columns: ["address"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["address"]
          },
        ]
      }
      teams: {
        Row: {
          address: string | null
          description: string | null
          id: string
          image: string | null
          name: string | null
          role: string | null
          x_account: string | null
        }
        Insert: {
          address?: string | null
          description?: string | null
          id?: string
          image?: string | null
          name?: string | null
          role?: string | null
          x_account?: string | null
        }
        Update: {
          address?: string | null
          description?: string | null
          id?: string
          image?: string | null
          name?: string | null
          role?: string | null
          x_account?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_address_fkey"
            columns: ["address"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["address"]
          },
        ]
      }
      technical_analysis: {
        Row: {
          address: string
          created_at: string
          description: string
          description_en: string | null
          id: number
          image: string
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string
          description: string
          description_en?: string | null
          id?: number
          image: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          description?: string
          description_en?: string | null
          id?: number
          image?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technical_analysis_address_fkey"
            columns: ["address"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["address"]
          },
        ]
      }
      tokens: {
        Row: {
          address: string
          archived_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          description_en: string | null
          image: string | null
          label: string | null
          name: string
          ordering: number | null
          tier: number | null
          updated_at: string
        }
        Insert: {
          address: string
          archived_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_en?: string | null
          image?: string | null
          label?: string | null
          name: string
          ordering?: number | null
          tier?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          archived_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          description_en?: string | null
          image?: string | null
          label?: string | null
          name?: string
          ordering?: number | null
          tier?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      transaction: {
        Row: {
          amount: number
          created_at: string
          from: string
          id: string
          to: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          amount: number
          created_at?: string
          from: string
          id: string
          to: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          amount?: number
          created_at?: string
          from?: string
          id?: string
          to?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      updates: {
        Row: {
          address: string
          created_at: string
          date: string
          description: string
          description_en: string | null
          id: number
          image: string | null
          link: string
          title: string
          title_en: string | null
        }
        Insert: {
          address: string
          created_at?: string
          date?: string
          description: string
          description_en?: string | null
          id?: number
          image?: string | null
          link: string
          title: string
          title_en?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          date?: string
          description?: string
          description_en?: string | null
          id?: number
          image?: string | null
          link?: string
          title?: string
          title_en?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "updates_address_fkey"
            columns: ["address"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["address"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
