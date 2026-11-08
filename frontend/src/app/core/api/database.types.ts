// Generated from executed Phase 02 migrations using PostgreSQL/PGlite with managed-schema test fixtures.
// Regenerate: npm run db:types:embedded. Full local Supabase generation remains npm run db:types.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export type Database = {
  public: {
    Tables: {
      app_permissions: {
        Row: {
          code: string;
        };
        Insert: {
          code: string;
        };
        Update: {
          code?: string;
        };
        Relationships: [];
      };
      app_roles: {
        Row: {
          code: string;
        };
        Insert: {
          code: string;
        };
        Update: {
          code?: string;
        };
        Relationships: [];
      };
      audit_events: {
        Row: {
          id: string;
          business_id: string;
          location_id: string | null;
          actor_user_id: string;
          action: string;
          object_id: string;
          detail: Json;
          occurred_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          location_id?: string | null;
          actor_user_id: string;
          action: string;
          object_id: string;
          detail?: Json;
          occurred_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          location_id?: string | null;
          actor_user_id?: string;
          action?: string;
          object_id?: string;
          detail?: Json;
          occurred_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'audit_events_actor_user_id_fkey';
            columns: ['actor_user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'audit_events_business_id_fkey';
            columns: ['business_id'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'audit_events_business_id_location_id_fkey';
            columns: ['business_id', 'location_id'];
            isOneToOne: false;
            referencedRelation: 'locations';
            referencedColumns: ['business_id', 'id'];
          },
        ];
      };
      business_members: {
        Row: {
          business_id: string;
          user_id: string;
          role_code: string;
          scope_mode: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          business_id: string;
          user_id: string;
          role_code: string;
          scope_mode: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          business_id?: string;
          user_id?: string;
          role_code?: string;
          scope_mode?: string;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'business_members_business_id_fkey';
            columns: ['business_id'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'business_members_role_code_fkey';
            columns: ['role_code'];
            isOneToOne: false;
            referencedRelation: 'app_roles';
            referencedColumns: ['code'];
          },
          {
            foreignKeyName: 'business_members_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      businesses: {
        Row: {
          id: string;
          name: string;
          owner_user_id: string;
          status: string;
          currency: string;
          time_zone: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_user_id: string;
          status?: string;
          currency?: string;
          time_zone?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          owner_user_id?: string;
          status?: string;
          currency?: string;
          time_zone?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'businesses_owner_user_id_fkey';
            columns: ['owner_user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      file_objects: {
        Row: {
          id: string;
          business_id: string;
          location_id: string;
          bucket_id: string;
          object_name: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          location_id: string;
          bucket_id: string;
          object_name: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          location_id?: string;
          bucket_id?: string;
          object_name?: string;
          created_by?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'file_objects_business_id_fkey';
            columns: ['business_id'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'file_objects_business_id_location_id_fkey';
            columns: ['business_id', 'location_id'];
            isOneToOne: false;
            referencedRelation: 'locations';
            referencedColumns: ['business_id', 'id'];
          },
          {
            foreignKeyName: 'file_objects_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      locations: {
        Row: {
          id: string;
          business_id: string;
          name: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'locations_business_id_fkey';
            columns: ['business_id'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id'];
          },
        ];
      };
      member_location_scopes: {
        Row: {
          business_id: string;
          user_id: string;
          location_id: string;
        };
        Insert: {
          business_id: string;
          user_id: string;
          location_id: string;
        };
        Update: {
          business_id?: string;
          user_id?: string;
          location_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'member_location_scopes_business_id_location_id_fkey';
            columns: ['business_id', 'location_id'];
            isOneToOne: false;
            referencedRelation: 'locations';
            referencedColumns: ['business_id', 'id'];
          },
          {
            foreignKeyName: 'member_location_scopes_business_id_user_id_fkey';
            columns: ['business_id', 'user_id'];
            isOneToOne: false;
            referencedRelation: 'business_members';
            referencedColumns: ['business_id', 'user_id'];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          display_name: string;
          locale: string;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          locale?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          locale?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      role_permissions: {
        Row: {
          role_code: string;
          permission_code: string;
        };
        Insert: {
          role_code: string;
          permission_code: string;
        };
        Update: {
          role_code?: string;
          permission_code?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'role_permissions_permission_code_fkey';
            columns: ['permission_code'];
            isOneToOne: false;
            referencedRelation: 'app_permissions';
            referencedColumns: ['code'];
          },
          {
            foreignKeyName: 'role_permissions_role_code_fkey';
            columns: ['role_code'];
            isOneToOne: false;
            referencedRelation: 'app_roles';
            referencedColumns: ['code'];
          },
        ];
      };
      staff_identity_links: {
        Row: {
          business_id: string;
          staff_id: string;
          user_id: string;
        };
        Insert: {
          business_id: string;
          staff_id: string;
          user_id: string;
        };
        Update: {
          business_id?: string;
          staff_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'staff_identity_links_business_id_staff_id_fkey';
            columns: ['business_id', 'staff_id'];
            isOneToOne: true;
            referencedRelation: 'staff_members';
            referencedColumns: ['business_id', 'id'];
          },
          {
            foreignKeyName: 'staff_identity_links_business_id_user_id_fkey';
            columns: ['business_id', 'user_id'];
            isOneToOne: true;
            referencedRelation: 'business_members';
            referencedColumns: ['business_id', 'user_id'];
          },
        ];
      };
      staff_members: {
        Row: {
          id: string;
          business_id: string;
          display_name: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          display_name: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          display_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'staff_members_business_id_fkey';
            columns: ['business_id'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      accept_invitation: {
        Args: {
          p_token: string;
        };
        Returns: string;
      };
      authorize_workspace: {
        Args: {
          p_business_id: string;
          p_permission: string;
          p_location_id?: string;
        };
        Returns: undefined;
      };
      bootstrap_business: {
        Args: {
          p_request_id: string;
          p_business_name: string;
          p_location_name: string;
        };
        Returns: string;
      };
      get_workspace_context: {
        Args: {
          [_ in never]: never;
        };
        Returns: Json;
      };
      issue_invitation: {
        Args: {
          p_business_id: string;
          p_email: string;
          p_role: string;
          p_scope_mode: string;
          p_location_ids: string[];
        };
        Returns: Json;
      };
      list_business_members: {
        Args: {
          p_business_id: string;
        };
        Returns: {
          user_id: string | null;
          display_name: string | null;
          role_code: string | null;
          scope_mode: string | null;
          active: boolean | null;
          location_ids: string[] | null;
        }[];
      };
      list_invitations: {
        Args: {
          p_business_id: string;
        };
        Returns: {
          id: string | null;
          email: string | null;
          role_code: string | null;
          expires_at: string | null;
          accepted_at: string | null;
          revoked_at: string | null;
        }[];
      };
      register_file: {
        Args: {
          p_business_id: string;
          p_location_id: string;
          p_extension: string;
          p_public_marketing?: boolean;
        };
        Returns: Json;
      };
      revoke_invitation: {
        Args: {
          p_business_id: string;
          p_invitation_id: string;
        };
        Returns: undefined;
      };
      set_member_access: {
        Args: {
          p_business_id: string;
          p_user_id: string;
          p_role: string;
          p_scope_mode: string;
          p_location_ids: string[];
          p_active: boolean;
        };
        Returns: undefined;
      };
      transfer_ownership: {
        Args: {
          p_business_id: string;
          p_new_owner: string;
        };
        Returns: undefined;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
