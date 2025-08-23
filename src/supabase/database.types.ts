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
      hashtags: {
        Row: {
          created_at: string
          hashtag_id: string
          post_id: string | null
          review_id: string | null
          tag_text: string[]
          updated_at: string
          user_id: string | null
          wine_id: string | null
        }
        Insert: {
          created_at?: string
          hashtag_id?: string
          post_id?: string | null
          review_id?: string | null
          tag_text: string[]
          updated_at?: string
          user_id?: string | null
          wine_id?: string | null
        }
        Update: {
          created_at?: string
          hashtag_id?: string
          post_id?: string | null
          review_id?: string | null
          tag_text?: string[]
          updated_at?: string
          user_id?: string | null
          wine_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hashtags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "hashtags_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["review_id"]
          },
          {
            foreignKeyName: "hashtags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "hashtags_wine_id_fkey"
            columns: ["wine_id"]
            isOneToOne: false
            referencedRelation: "wines"
            referencedColumns: ["wine_id"]
          },
        ]
      }
      pairings: {
        Row: {
          created_at: string
          pairing_category: string | null
          pairing_id: string
          pairing_name: string
          review_id: string
          updated_at: string
          user_id: string | null
          wine_id: string
        }
        Insert: {
          created_at?: string
          pairing_category?: string | null
          pairing_id?: string
          pairing_name?: string
          review_id: string
          updated_at?: string
          user_id?: string | null
          wine_id: string
        }
        Update: {
          created_at?: string
          pairing_category?: string | null
          pairing_id?: string
          pairing_name?: string
          review_id?: string
          updated_at?: string
          user_id?: string | null
          wine_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pairings_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["review_id"]
          },
          {
            foreignKeyName: "pairings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "pairings_wine_id_fkey"
            columns: ["wine_id"]
            isOneToOne: false
            referencedRelation: "wines"
            referencedColumns: ["wine_id"]
          },
        ]
      }
      post_like: {
        Row: {
          created_at: string
          likes: boolean
          post_id: string
          post_like_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          likes?: boolean
          post_id: string
          post_like_id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          likes?: boolean
          post_id?: string
          post_like_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_like_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_like_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          hashtag_list: string[] | null
          image_url: string[] | null
          like_count: number
          post_category: Database["public"]["Enums"]["post_category"]
          post_id: string
          reply_count: number
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          hashtag_list?: string[] | null
          image_url?: string[] | null
          like_count?: number
          post_category: Database["public"]["Enums"]["post_category"]
          post_id?: string
          reply_count?: number
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          hashtag_list?: string[] | null
          image_url?: string[] | null
          like_count?: number
          post_category?: Database["public"]["Enums"]["post_category"]
          post_id?: string
          reply_count?: number
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profile: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          nickname: string
          profile_id: string
          profile_image_url: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email: string
          nickname: string
          profile_id?: string
          profile_image_url?: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          nickname?: string
          profile_id?: string
          profile_image_url?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reply: {
        Row: {
          content: string
          created_at: string
          like_count: number
          parent_id: string | null
          post_id: string
          reply_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          like_count?: number
          parent_id?: string | null
          post_id: string
          reply_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          like_count?: number
          parent_id?: string | null
          post_id?: string
          reply_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reply_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "reply_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      reply_like: {
        Row: {
          created_at: string
          likes: boolean
          reply_id: string
          reply_like_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          likes?: boolean
          reply_id: string
          reply_like_id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          likes?: boolean
          reply_id?: string
          reply_like_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reply_like_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "reply"
            referencedColumns: ["reply_id"]
          },
          {
            foreignKeyName: "reply_like_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      review_like: {
        Row: {
          created_at: string
          likes: boolean
          review_id: string
          review_reply_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          likes?: boolean
          review_id: string
          review_like_id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          likes?: boolean
          review_id?: string
          review_like_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_like_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["review_id"]
          },
          {
            foreignKeyName: "review_like_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      reviews: {
        Row: {
          acidity_score: number | null
          body_score: number | null
          content: string
          created_at: string
          likes: number
          rating: number
          review_id: string
          sweetness_score: number | null
          tannin_score: number | null
          updated_at: string
          user_id: string | null
          wine_id: string
        }
        Insert: {
          acidity_score?: number | null
          body_score?: number | null
          content: string
          created_at?: string
          likes?: number
          rating: number
          review_id?: string
          sweetness_score?: number | null
          tannin_score?: number | null
          updated_at?: string
          user_id?: string | null
          wine_id: string
        }
        Update: {
          acidity_score?: number | null
          body_score?: number | null
          content?: string
          created_at?: string
          likes?: number
          rating?: number
          review_id?: string
          sweetness_score?: number | null
          tannin_score?: number | null
          updated_at?: string
          user_id?: string | null
          wine_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "reviews_wine_id_fkey"
            columns: ["wine_id"]
            isOneToOne: false
            referencedRelation: "wines"
            referencedColumns: ["wine_id"]
          },
        ]
      }
      user_badge: {
        Row: {
          activity_id: string
          badge_type: string[]
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_id?: string
          badge_type: string[]
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          badge_type?: string[]
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badge_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      wines: {
        Row: {
          abv: number | null
          acidity_score: number | null
          body_score: number | null
          category: Database["public"]["Enums"]["wine_category"] | null
          country: string | null
          created_at: string
          description: string | null
          image_url: string | null
          name: string
          representative_flavor: string[] | null
          sweetness_score: number | null
          tannin_score: number | null
          variety: string | null
          wine_id: string
        }
        Insert: {
          abv?: number | null
          acidity_score?: number | null
          body_score?: number | null
          category?: Database["public"]["Enums"]["wine_category"] | null
          country?: string | null
          created_at?: string
          description?: string | null
          image_url?: string | null
          name: string
          representative_flavor?: string[] | null
          sweetness_score?: number | null
          tannin_score?: number | null
          variety?: string | null
          wine_id?: string
        }
        Update: {
          abv?: number | null
          acidity_score?: number | null
          body_score?: number | null
          category?: Database["public"]["Enums"]["wine_category"] | null
          country?: string | null
          created_at?: string
          description?: string | null
          image_url?: string | null
          name?: string
          representative_flavor?: string[] | null
          sweetness_score?: number | null
          tannin_score?: number | null
          variety?: string | null
          wine_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          bookmark: boolean
          created_at: string
          updated_at: string
          user_id: string
          wine_id: string
          wishlist_id: string
        }
        Insert: {
          bookmark?: boolean
          created_at?: string
          updated_at?: string
          user_id: string
          wine_id: string
          wishlist_id?: string
        }
        Update: {
          bookmark?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
          wine_id?: string
          wishlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "wishlists_wine_id_fkey"
            columns: ["wine_id"]
            isOneToOne: false
            referencedRelation: "wines"
            referencedColumns: ["wine_id"]
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
      post_category: "free" | "question" | "review"
      wine_category: "red" | "white" | "rose" | "sparkling" | "dessert"
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
      post_category: ["free", "question", "review"],
      wine_category: ["red", "white", "rose", "sparkling", "dessert"],
    },
  },
} as const
