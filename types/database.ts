export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums
export type UserRole = 'customer' | 'admin' | 'super_admin'
export type InvitationStatus = 'draft' | 'submitted' | 'locked' | 'unlocked_by_admin' | 'completed'
export type EventType = 'traditional_wedding' | 'white_wedding' | 'reception' | 'after_party'
export type PackageTier = 'essential' | 'premium' | 'ultimate'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type RsvpStatus = 'attending' | 'not_attending' | 'maybe'
export type MediaType = 'image' | 'video' | 'document'
export type MediaProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type MediaModerationStatus = 'pending' | 'approved' | 'rejected'
export type GiftClaimStatus = 'intended' | 'purchased' | 'delivered'
export type CustomRequestStatus = 'new' | 'contacted' | 'quoted' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
export type LivestreamStatus = 'inactive' | 'scheduled' | 'active' | 'ended'
export type TemplateStatus = 'draft' | 'active' | 'retired'
export type DesignType = '2d_basic' | '2d_animated' | '2d_advanced' | '3d_selected' | '3d_advanced'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          email: string
          phone: string | null
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: UserRole
          email: string
          phone?: string | null
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: UserRole
          email?: string
          phone?: string | null
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      packages: {
        Row: {
          id: string
          tier: PackageTier
          name: string
          description: string | null
          price_ngn: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tier: PackageTier
          name: string
          description?: string | null
          price_ngn: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tier?: PackageTier
          name?: string
          description?: string | null
          price_ngn?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      package_features: {
        Row: {
          id: string
          package_id: string
          feature_key: string
          feature_name: string
          feature_description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          package_id: string
          feature_key: string
          feature_name: string
          feature_description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          feature_key?: string
          feature_name?: string
          feature_description?: string | null
          created_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string | null
          design_type: DesignType
          category: string | null
          minimum_package: PackageTier
          preview_url: string | null
          thumbnail_url: string | null
          status: TemplateStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          design_type: DesignType
          category?: string | null
          minimum_package: PackageTier
          preview_url?: string | null
          thumbnail_url?: string | null
          status?: TemplateStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          design_type?: DesignType
          category?: string | null
          minimum_package?: PackageTier
          preview_url?: string | null
          thumbnail_url?: string | null
          status?: TemplateStatus
          created_at?: string
          updated_at?: string
        }
      }
      template_versions: {
        Row: {
          id: string
          template_id: string
          version_number: number
          config: Json
          is_current: boolean
          created_at: string
        }
        Insert: {
          id?: string
          template_id: string
          version_number: number
          config: Json
          is_current?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          template_id?: string
          version_number?: number
          config?: Json
          is_current?: boolean
          created_at?: string
        }
      }
      invitations: {
        Row: {
          id: string
          customer_id: string
          package_id: string
          template_id: string | null
          template_version_id: string | null
          status: InvitationStatus
          slug: string | null
          couple_name_primary: string | null
          couple_name_secondary: string | null
          event_date: string | null
          custom_data: Json | null
          submitted_at: string | null
          locked_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          package_id: string
          template_id?: string | null
          template_version_id?: string | null
          status?: InvitationStatus
          slug?: string | null
          couple_name_primary?: string | null
          couple_name_secondary?: string | null
          event_date?: string | null
          custom_data?: Json | null
          submitted_at?: string | null
          locked_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          package_id?: string
          template_id?: string | null
          template_version_id?: string | null
          status?: InvitationStatus
          slug?: string | null
          couple_name_primary?: string | null
          couple_name_secondary?: string | null
          event_date?: string | null
          custom_data?: Json | null
          submitted_at?: string | null
          locked_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invitation_versions: {
        Row: {
          id: string
          invitation_id: string
          version_number: number
          data: Json
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          invitation_id: string
          version_number: number
          data: Json
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          invitation_id?: string
          version_number?: number
          data?: Json
          created_by?: string | null
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          invitation_id: string
          event_type: EventType
          title: string
          address: string
          latitude: number | null
          longitude: number | null
          map_url: string | null
          directions_info: string | null
          event_datetime: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invitation_id: string
          event_type: EventType
          title: string
          address: string
          latitude?: number | null
          longitude?: number | null
          map_url?: string | null
          directions_info?: string | null
          event_datetime?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invitation_id?: string
          event_type?: EventType
          title?: string
          address?: string
          latitude?: number | null
          longitude?: number | null
          map_url?: string | null
          directions_info?: string | null
          event_datetime?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      guests: {
        Row: {
          id: string
          invitation_id: string
          name: string
          phone: string
          accessed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invitation_id: string
          name: string
          phone: string
          accessed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invitation_id?: string
          name?: string
          phone?: string
          accessed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rsvps: {
        Row: {
          id: string
          invitation_id: string
          guest_id: string
          status: RsvpStatus
          guest_count: number | null
          message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invitation_id: string
          guest_id: string
          status: RsvpStatus
          guest_count?: number | null
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invitation_id?: string
          guest_id?: string
          status?: RsvpStatus
          guest_count?: number | null
          message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gift_registries: {
        Row: {
          id: string
          invitation_id: string
          delivery_address: string | null
          bank_name: string | null
          account_name: string | null
          account_number: string | null
          payment_gateway_config: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invitation_id: string
          delivery_address?: string | null
          bank_name?: string | null
          account_name?: string | null
          account_number?: string | null
          payment_gateway_config?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invitation_id?: string
          delivery_address?: string | null
          bank_name?: string | null
          account_name?: string | null
          account_number?: string | null
          payment_gateway_config?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      gift_registry_items: {
        Row: {
          id: string
          registry_id: string
          item_name: string
          item_description: string | null
          item_url: string | null
          quantity_desired: number | null
          quantity_claimed: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          registry_id: string
          item_name: string
          item_description?: string | null
          item_url?: string | null
          quantity_desired?: number | null
          quantity_claimed?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          registry_id?: string
          item_name?: string
          item_description?: string | null
          item_url?: string | null
          quantity_desired?: number | null
          quantity_claimed?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      gift_claims: {
        Row: {
          id: string
          registry_item_id: string
          guest_id: string
          quantity: number
          status: GiftClaimStatus
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          registry_item_id: string
          guest_id: string
          quantity?: number
          status?: GiftClaimStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          registry_item_id?: string
          guest_id?: string
          quantity?: number
          status?: GiftClaimStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          package_id: string
          amount_ngn: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          package_id: string
          amount_ngn: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          package_id?: string
          amount_ngn?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          provider: string
          provider_reference: string
          amount_ngn: number
          status: PaymentStatus
          metadata: Json | null
          verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          provider: string
          provider_reference: string
          amount_ngn: number
          status?: PaymentStatus
          metadata?: Json | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          provider?: string
          provider_reference?: string
          amount_ngn?: number
          status?: PaymentStatus
          metadata?: Json | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      media: {
        Row: {
          id: string
          invitation_id: string
          uploader_id: string | null
          guest_id: string | null
          media_type: MediaType
          storage_path: string
          original_filename: string | null
          file_size_bytes: number | null
          mime_type: string | null
          processing_status: MediaProcessingStatus
          moderation_status: MediaModerationStatus
          is_visible: boolean
          width: number | null
          height: number | null
          duration_seconds: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invitation_id: string
          uploader_id?: string | null
          guest_id?: string | null
          media_type: MediaType
          storage_path: string
          original_filename?: string | null
          file_size_bytes?: number | null
          mime_type?: string | null
          processing_status?: MediaProcessingStatus
          moderation_status?: MediaModerationStatus
          is_visible?: boolean
          width?: number | null
          height?: number | null
          duration_seconds?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invitation_id?: string
          uploader_id?: string | null
          guest_id?: string | null
          media_type?: MediaType
          storage_path?: string
          original_filename?: string | null
          file_size_bytes?: number | null
          mime_type?: string | null
          processing_status?: MediaProcessingStatus
          moderation_status?: MediaModerationStatus
          is_visible?: boolean
          width?: number | null
          height?: number | null
          duration_seconds?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      livestreams: {
        Row: {
          id: string
          invitation_id: string
          external_url: string
          title: string | null
          status: LivestreamStatus
          scheduled_start: string | null
          activated_at: string | null
          ended_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invitation_id: string
          external_url: string
          title?: string | null
          status?: LivestreamStatus
          scheduled_start?: string | null
          activated_at?: string | null
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invitation_id?: string
          external_url?: string
          title?: string | null
          status?: LivestreamStatus
          scheduled_start?: string | null
          activated_at?: string | null
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      custom_invitation_requests: {
        Row: {
          id: string
          name: string
          phone: string
          email: string
          status: CustomRequestStatus
          internal_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email: string
          status?: CustomRequestStatus
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string
          status?: CustomRequestStatus
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          is_read: boolean
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          is_read?: boolean
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          is_read?: boolean
          metadata?: Json | null
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          actor_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          old_data: Json | null
          new_data: Json | null
          metadata: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          metadata?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          actor_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          metadata?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: UserRole
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      generate_invitation_slug: {
        Args: { couple_name: string }
        Returns: string
      }
      create_audit_log: {
        Args: {
          p_actor_id: string
          p_action: string
          p_resource_type: string
          p_resource_id: string
          p_old_data?: Json
          p_new_data?: Json
          p_metadata?: Json
        }
        Returns: string
      }
      check_package_features: {
        Args: {
          p_invitation_id: string
          p_feature_key: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
      invitation_status: InvitationStatus
      event_type: EventType
      package_tier: PackageTier
      payment_status: PaymentStatus
      rsvp_status: RsvpStatus
      media_type: MediaType
      media_processing_status: MediaProcessingStatus
      media_moderation_status: MediaModerationStatus
      gift_claim_status: GiftClaimStatus
      custom_request_status: CustomRequestStatus
      livestream_status: LivestreamStatus
      template_status: TemplateStatus
      design_type: DesignType
    }
  }
}
