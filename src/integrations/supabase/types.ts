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
      login_history: {
        Row: {
          created_at: string
          device_info: string | null
          id: string
          ip_address: unknown | null
          location: string | null
          login_date: string
          success: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: string | null
          id?: string
          ip_address?: unknown | null
          location?: string | null
          login_date?: string
          success?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: string | null
          id?: string
          ip_address?: unknown | null
          location?: string | null
          login_date?: string
          success?: boolean
          user_id?: string
        }
        Relationships: []
      }
      materials: {
        Row: {
          cost_per_unit: number | null
          created_at: string
          description: string | null
          id: string
          name: string
          supplier: string | null
          type: string | null
          unit_of_measurement: string | null
          updated_at: string
        }
        Insert: {
          cost_per_unit?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          supplier?: string | null
          type?: string | null
          unit_of_measurement?: string | null
          updated_at?: string
        }
        Update: {
          cost_per_unit?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          supplier?: string | null
          type?: string | null
          unit_of_measurement?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payment_status: {
        Row: {
          created_at: string
          id: string
          payment_completed: boolean
          payment_date: string | null
          plan_id: string | null
          plan_name: string | null
          subscription_active: boolean
          subscription_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payment_completed?: boolean
          payment_date?: string | null
          plan_id?: string | null
          plan_name?: string | null
          subscription_active?: boolean
          subscription_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payment_completed?: boolean
          payment_date?: string | null
          plan_id?: string | null
          plan_name?: string | null
          subscription_active?: boolean
          subscription_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          biografia: string | null
          cargo: string | null
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          professional_role: string | null
          profile_picture_url: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          biografia?: string | null
          cargo?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          professional_role?: string | null
          profile_picture_url?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          biografia?: string | null
          cargo?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          professional_role?: string | null
          profile_picture_url?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_documents: {
        Row: {
          description: string | null
          file_name: string
          file_type: string | null
          id: string
          project_id: string
          storage_path: string
          uploaded_at: string | null
        }
        Insert: {
          description?: string | null
          file_name: string
          file_type?: string | null
          id?: string
          project_id: string
          storage_path: string
          uploaded_at?: string | null
        }
        Update: {
          description?: string | null
          file_name?: string
          file_type?: string | null
          id?: string
          project_id?: string
          storage_path?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_reports_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      project_materials: {
        Row: {
          category: string | null
          cost_per_unit: number | null
          created_at: string | null
          dimensions_specs: string | null
          estimated_quantity: number | null
          id: string
          material_type_name: string
          minimum_quantity: number | null
          project_id: string
          stock_quantity: number | null
          supplier_id: string | null
          unit_of_measurement: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          cost_per_unit?: number | null
          created_at?: string | null
          dimensions_specs?: string | null
          estimated_quantity?: number | null
          id?: string
          material_type_name: string
          minimum_quantity?: number | null
          project_id: string
          stock_quantity?: number | null
          supplier_id?: string | null
          unit_of_measurement?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          cost_per_unit?: number | null
          created_at?: string | null
          dimensions_specs?: string | null
          estimated_quantity?: number | null
          id?: string
          material_type_name?: string
          minimum_quantity?: number | null
          project_id?: string
          stock_quantity?: number | null
          supplier_id?: string | null
          unit_of_measurement?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_materials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_reports_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_materials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_materials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_progress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_materials_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      project_stage_waste: {
        Row: {
          created_at: string
          id: string
          measurement_date: string
          measurement_unit: string | null
          notes: string | null
          project_id: string
          stage_name: string
          updated_at: string
          waste_cost: number | null
          waste_quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          measurement_date?: string
          measurement_unit?: string | null
          notes?: string | null
          project_id: string
          stage_name: string
          updated_at?: string
          waste_cost?: number | null
          waste_quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          measurement_date?: string
          measurement_unit?: string | null
          notes?: string | null
          project_id?: string
          stage_name?: string
          updated_at?: string
          waste_cost?: number | null
          waste_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_stage_waste_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_reports_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_stage_waste_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_stage_waste_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          arquivado: boolean
          budget: number | null
          created_at: string | null
          description_notes: string | null
          dimensions_details: string | null
          id: string
          location: string | null
          name: string
          planned_end_date: string | null
          project_type: string | null
          responsible_team_contacts: string | null
          start_date: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          arquivado?: boolean
          budget?: number | null
          created_at?: string | null
          description_notes?: string | null
          dimensions_details?: string | null
          id?: string
          location?: string | null
          name: string
          planned_end_date?: string | null
          project_type?: string | null
          responsible_team_contacts?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          arquivado?: boolean
          budget?: number | null
          created_at?: string | null
          description_notes?: string | null
          dimensions_details?: string | null
          id?: string
          location?: string | null
          name?: string
          planned_end_date?: string | null
          project_type?: string | null
          responsible_team_contacts?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      recomendacoes: {
        Row: {
          aceita: boolean
          created_at: string
          data_criacao: string
          descricao: string | null
          id: string
          projeto_id: string
          titulo: string
          updated_at: string
          visualizada: boolean
        }
        Insert: {
          aceita?: boolean
          created_at?: string
          data_criacao?: string
          descricao?: string | null
          id?: string
          projeto_id: string
          titulo: string
          updated_at?: string
          visualizada?: boolean
        }
        Update: {
          aceita?: boolean
          created_at?: string
          data_criacao?: string
          descricao?: string | null
          id?: string
          projeto_id?: string
          titulo?: string
          updated_at?: string
          visualizada?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "recomendacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "project_reports_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "recomendacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recomendacoes_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projects_with_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          content: string | null
          created_at: string
          data: Json | null
          generated_at: string
          id: string
          project_id: string
          report_type: string
          title: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          data?: Json | null
          generated_at?: string
          id?: string
          project_id: string
          report_type?: string
          title: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          data?: Json | null
          generated_at?: string
          id?: string
          project_id?: string
          report_type?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_reports_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          created_at: string
          id: string
          is_from_user: boolean
          message: string
          sender_email: string
          sender_name: string
          ticket_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_from_user?: boolean
          message: string
          sender_email: string
          sender_name: string
          ticket_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_from_user?: boolean
          message?: string
          sender_email?: string
          sender_name?: string
          ticket_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by_user_id: string
          name: string
          status: string
          token: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by_user_id: string
          name: string
          status?: string
          token: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by_user_id?: string
          name?: string
          status?: string
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_member_projects: {
        Row: {
          assigned_at: string
          assigned_by: string
          id: string
          project_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          id?: string
          project_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          id?: string
          project_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_member_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_reports_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "team_member_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_member_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          browser_notifications: boolean
          created_at: string
          email_notifications: boolean
          id: string
          language: string
          project_updates: boolean
          recommendation_alerts: boolean
          sms_notifications: boolean
          system_alerts: boolean
          theme: string
          timezone: string
          two_factor_enabled: boolean
          two_factor_secret: string | null
          updated_at: string
          user_id: string
          weekly_summary: boolean
        }
        Insert: {
          browser_notifications?: boolean
          created_at?: string
          email_notifications?: boolean
          id?: string
          language?: string
          project_updates?: boolean
          recommendation_alerts?: boolean
          sms_notifications?: boolean
          system_alerts?: boolean
          theme?: string
          timezone?: string
          two_factor_enabled?: boolean
          two_factor_secret?: string | null
          updated_at?: string
          user_id: string
          weekly_summary?: boolean
        }
        Update: {
          browser_notifications?: boolean
          created_at?: string
          email_notifications?: boolean
          id?: string
          language?: string
          project_updates?: boolean
          recommendation_alerts?: boolean
          sms_notifications?: boolean
          system_alerts?: boolean
          theme?: string
          timezone?: string
          two_factor_enabled?: boolean
          two_factor_secret?: string | null
          updated_at?: string
          user_id?: string
          weekly_summary?: boolean
        }
        Relationships: []
      }
      waste_entries: {
        Row: {
          created_at: string | null
          entry_date: string
          id: string
          notes: string | null
          project_material_id: string
          project_stage: string
          updated_at: string | null
          waste_cause_category: string | null
          wasted_quantity: number
        }
        Insert: {
          created_at?: string | null
          entry_date?: string
          id?: string
          notes?: string | null
          project_material_id: string
          project_stage: string
          updated_at?: string | null
          waste_cause_category?: string | null
          wasted_quantity: number
        }
        Update: {
          created_at?: string | null
          entry_date?: string
          id?: string
          notes?: string | null
          project_material_id?: string
          project_stage?: string
          updated_at?: string | null
          waste_cause_category?: string | null
          wasted_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "waste_entries_project_material_id_fkey"
            columns: ["project_material_id"]
            isOneToOne: false
            referencedRelation: "materials_with_project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waste_entries_project_material_id_fkey"
            columns: ["project_material_id"]
            isOneToOne: false
            referencedRelation: "project_materials"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      dashboard_metrics: {
        Row: {
          active_projects: number | null
          total_economy_generated: number | null
          total_materials: number | null
          total_projects: number | null
          total_waste_entries: number | null
          total_waste_quantity: number | null
          user_id: string | null
        }
        Relationships: []
      }
      materials_with_project: {
        Row: {
          category: string | null
          cost_per_unit: number | null
          created_at: string | null
          dimensions_specs: string | null
          estimated_quantity: number | null
          id: string | null
          material_type_name: string | null
          minimum_quantity: number | null
          project_id: string | null
          project_name: string | null
          project_status: string | null
          stock_quantity: number | null
          stock_status: string | null
          supplier_id: string | null
          total_estimated_cost: number | null
          unit_of_measurement: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_materials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_reports_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_materials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_materials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_progress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_materials_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      project_reports_summary: {
        Row: {
          created_at: string | null
          project_id: string | null
          project_location: string | null
          project_name: string | null
          project_status: string | null
          total_materials: number | null
          total_project_cost: number | null
          total_waste_cost: number | null
          total_waste_quantity: number | null
          user_id: string | null
          waste_entries_count: number | null
        }
        Relationships: []
      }
      projects_with_progress: {
        Row: {
          arquivado: boolean | null
          budget: number | null
          created_at: string | null
          description_notes: string | null
          dimensions_details: string | null
          id: string | null
          location: string | null
          materials_count: number | null
          name: string | null
          planned_end_date: string | null
          progress_percentage: number | null
          project_type: string | null
          responsible_team_contacts: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          waste_entries_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_delete_team_member_profile: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      generate_invitation_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search_projects: {
        Args: { search_term: string; user_id_param: string }
        Returns: {
          id: string
          name: string
          status: string
          location: string
          progress_percentage: number
          materials_count: number
          created_at: string
        }[]
      }
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
