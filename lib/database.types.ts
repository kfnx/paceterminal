export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      metrics_static: {
        Row: {
          address: string
          created_at: string
          description: string | null
          id: number
          label: string
          ordering: number | null
          source: string | null
          updated_at: string
          value: string
        }
        Insert: {
          address: string
          created_at?: string
          description?: string | null
          id?: number
          label: string
          ordering?: number | null
          source?: string | null
          updated_at?: string
          value: string
        }
        Update: {
          address?: string
          created_at?: string
          description?: string | null
          id?: number
          label?: string
          ordering?: number | null
          source?: string | null
          updated_at?: string
          value?: string
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
          id: number
          image: string
        }
        Insert: {
          address: string
          created_at?: string
          description: string
          id?: number
          image: string
        }
        Update: {
          address?: string
          created_at?: string
          description?: string
          id?: number
          image?: string
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
          created_at: string
          created_by: string | null
          description: string | null
          image: string | null
          label: string | null
          name: string
          ordering: number | null
          tier: number | null
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          image?: string | null
          label?: string | null
          name: string
          ordering?: number | null
          tier?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
