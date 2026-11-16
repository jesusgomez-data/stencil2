export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ProductColorJson = {
  label: string
  hex: string
}

export type ProductSizesJson = {
  varillas?: string
  puente?: string
  frontal?: string
  altura?: string
}

export type ShippingAddressJson = {
  name?: string
  address?: string
  city?: string
  postalCode?: string
  email?: string
  phone?: string
}

export type OrderItemJson = {
  id: string
  code?: string
  name: string
  slug: string
  price: number
  image?: string
  model?: string
  color?: string
  colorLabel?: string
  quantity: number
}

export type DbProduct = {
  id: string
  product_key: string
  letter: string
  code: string
  name: string
  subtitle: string | null
  slug: string
  aliases: string[]
  price: number
  compare_at_price: number | null
  gender: 'men' | 'women' | 'unisex'
  model: 'wayfarer' | 'round' | 'shield' | 'aviator' | 'cat-eye' | 'sport'
  description: string | null
  composition: string | null
  material: string | null
  lens: string | null
  frame_color: string | null
  glasses_color: string | null
  frame_type: string | null
  logo: string | null
  colors: ProductColorJson[]
  sizes: ProductSizesJson
  main_image: string | null
  gallery: string[]
  model_3d_url: string | null
  stock: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export type DbProductInsert = {
  id?: string
  product_key: string
  letter: string
  code: string
  name: string
  subtitle?: string | null
  slug: string
  aliases?: string[]
  price: number
  compare_at_price?: number | null
  gender?: 'men' | 'women' | 'unisex'
  model: 'wayfarer' | 'round' | 'shield' | 'aviator' | 'cat-eye' | 'sport'
  description?: string | null
  composition?: string | null
  material?: string | null
  lens?: string | null
  frame_color?: string | null
  glasses_color?: string | null
  frame_type?: string | null
  logo?: string | null
  colors?: ProductColorJson[]
  sizes?: ProductSizesJson
  main_image?: string | null
  gallery?: string[]
  model_3d_url?: string | null
  stock?: number
  is_featured?: boolean
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export type DbProductUpdate = Partial<DbProductInsert>

export type DbProductVariant = {
  id: string
  product_id: string
  sku: string
  color_label: string
  color_hex: string
  stock: number
  price_override: number | null
  is_active: boolean
  created_at: string
}

export type DbProductVariantInsert = {
  id?: string
  product_id: string
  sku: string
  color_label: string
  color_hex: string
  stock?: number
  price_override?: number | null
  is_active?: boolean
  created_at?: string
}

export type DbProductVariantUpdate = Partial<DbProductVariantInsert>

export type DbProfile = {
  id: string
  auth_user_id: string | null
  email: string
  full_name: string | null
  phone: string | null
  default_shipping_address: ShippingAddressJson
  loyalty_points: number
  tier: 'member' | 'silver' | 'gold' | 'vip'
  role: 'customer' | 'admin'
  created_at: string
  updated_at: string
}

export type DbProfileInsert = {
  id?: string
  auth_user_id?: string | null
  email: string
  full_name?: string | null
  phone?: string | null
  default_shipping_address?: ShippingAddressJson
  loyalty_points?: number
  tier?: 'member' | 'silver' | 'gold' | 'vip'
  role?: 'customer' | 'admin'
  created_at?: string
  updated_at?: string
}

export type DbProfileUpdate = Partial<DbProfileInsert>

export type DbPromoCode = {
  id: string
  code: string
  description: string | null
  discount_type: 'percent' | 'fixed' | 'free_shipping' | 'fixed_total'
  discount_value: number
  min_order_amount: number
  free_shipping: boolean
  points_cost: number
  max_uses: number | null
  used_count: number
  expires_at: string | null
  is_active: boolean
  created_at: string
}

export type DbPromoCodeInsert = {
  id?: string
  code: string
  description?: string | null
  discount_type: 'percent' | 'fixed' | 'free_shipping' | 'fixed_total'
  discount_value?: number
  min_order_amount?: number
  free_shipping?: boolean
  points_cost?: number
  max_uses?: number | null
  used_count?: number
  expires_at?: string | null
  is_active?: boolean
  created_at?: string
}

export type DbPromoCodeUpdate = Partial<DbPromoCodeInsert>

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type DbOrder = {
  id: string
  order_number: string
  customer_id: string | null
  customer_email: string
  customer_name: string | null
  customer_phone: string | null
  stripe_id: string | null
  status: OrderStatus
  items: OrderItemJson[]
  subtotal: number
  discount: number
  taxable_base: number
  tax: number
  shipping: number
  total: number
  promo_code: string | null
  points_earned: number
  shipping_address: ShippingAddressJson
  tracking_number: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type DbOrderInsert = {
  id?: string
  order_number: string
  customer_id?: string | null
  customer_email: string
  customer_name?: string | null
  customer_phone?: string | null
  stripe_id?: string | null
  status?: OrderStatus
  items?: OrderItemJson[]
  subtotal?: number
  discount?: number
  taxable_base?: number
  tax?: number
  shipping?: number
  total?: number
  promo_code?: string | null
  points_earned?: number
  shipping_address?: ShippingAddressJson
  tracking_number?: string | null
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export type DbOrderUpdate = Partial<DbOrderInsert>

export type DbOrderItem = {
  id: string
  order_id: string
  product_id: string | null
  product_slug: string
  product_code: string | null
  product_name: string
  model: string | null
  color_hex: string | null
  color_label: string | null
  unit_price: number
  quantity: number
  line_total: number
  image: string | null
  created_at: string
}

export type DbOrderItemInsert = {
  id?: string
  order_id: string
  product_id?: string | null
  product_slug: string
  product_code?: string | null
  product_name: string
  model?: string | null
  color_hex?: string | null
  color_label?: string | null
  unit_price: number
  quantity: number
  line_total: number
  image?: string | null
  created_at?: string
}

export type DbOrderItemUpdate = Partial<DbOrderItemInsert>

export type DbLoyaltyTransaction = {
  id: string
  customer_id: string | null
  customer_email: string
  order_id: string | null
  points_delta: number
  reason: string
  reward_code: string | null
  created_at: string
}

export type DbLoyaltyTransactionInsert = {
  id?: string
  customer_id?: string | null
  customer_email: string
  order_id?: string | null
  points_delta: number
  reason: string
  reward_code?: string | null
  created_at?: string
}

export type DbLoyaltyTransactionUpdate = Partial<DbLoyaltyTransactionInsert>

export type DbFavorite = {
  id: string
  customer_email: string | null
  session_id: string | null
  product_slug: string
  product_id: string | null
  created_at: string
}

export type DbFavoriteInsert = {
  id?: string
  customer_email?: string | null
  session_id?: string | null
  product_slug: string
  product_id?: string | null
  created_at?: string
}

export type DbFavoriteUpdate = Partial<DbFavoriteInsert>

export type DbNewsletterSubscriber = {
  id: string
  email: string
  promo_code_sent: string | null
  privacy_accepted: boolean
  is_active: boolean
  source: string | null
  created_at: string
}

export type DbNewsletterSubscriberInsert = {
  id?: string
  email: string
  promo_code_sent?: string | null
  privacy_accepted?: boolean
  is_active?: boolean
  source?: string | null
  created_at?: string
}

export type DbNewsletterSubscriberUpdate = Partial<DbNewsletterSubscriberInsert>

export type DbContactMessage = {
  id: string
  email: string
  name: string | null
  message: string
  privacy_accepted: boolean
  status: 'new' | 'in_progress' | 'resolved' | 'archived'
  created_at: string
}

export type DbContactMessageInsert = {
  id?: string
  email: string
  name?: string | null
  message: string
  privacy_accepted?: boolean
  status?: 'new' | 'in_progress' | 'resolved' | 'archived'
  created_at?: string
}

export type DbContactMessageUpdate = Partial<DbContactMessageInsert>

export type DbDistributorLead = {
  id: string
  email: string
  company_name: string | null
  phone: string | null
  notes: string | null
  privacy_accepted: boolean
  status: 'pending' | 'contacted' | 'approved' | 'rejected'
  created_at: string
}

export type DbDistributorLeadInsert = {
  id?: string
  email: string
  company_name?: string | null
  phone?: string | null
  notes?: string | null
  privacy_accepted?: boolean
  status?: 'pending' | 'contacted' | 'approved' | 'rejected'
  created_at?: string
}

export type DbDistributorLeadUpdate = Partial<DbDistributorLeadInsert>

export interface Database {
  public: {
    Tables: {
      products: {
        Row: DbProduct
        Insert: DbProductInsert
        Update: DbProductUpdate
        Relationships: []
      }
      product_variants: {
        Row: DbProductVariant
        Insert: DbProductVariantInsert
        Update: DbProductVariantUpdate
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      profiles: {
        Row: DbProfile
        Insert: DbProfileInsert
        Update: DbProfileUpdate
        Relationships: []
      }
      promo_codes: {
        Row: DbPromoCode
        Insert: DbPromoCodeInsert
        Update: DbPromoCodeUpdate
        Relationships: []
      }
      orders: {
        Row: DbOrder
        Insert: DbOrderInsert
        Update: DbOrderUpdate
        Relationships: [
          {
            foreignKeyName: 'orders_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      order_items: {
        Row: DbOrderItem
        Insert: DbOrderItemInsert
        Update: DbOrderItemUpdate
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      loyalty_transactions: {
        Row: DbLoyaltyTransaction
        Insert: DbLoyaltyTransactionInsert
        Update: DbLoyaltyTransactionUpdate
        Relationships: [
          {
            foreignKeyName: 'loyalty_transactions_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'loyalty_transactions_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          }
        ]
      }
      favorites: {
        Row: DbFavorite
        Insert: DbFavoriteInsert
        Update: DbFavoriteUpdate
        Relationships: [
          {
            foreignKeyName: 'favorites_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      newsletter_subscribers: {
        Row: DbNewsletterSubscriber
        Insert: DbNewsletterSubscriberInsert
        Update: DbNewsletterSubscriberUpdate
        Relationships: []
      }
      contact_messages: {
        Row: DbContactMessage
        Insert: DbContactMessageInsert
        Update: DbContactMessageUpdate
        Relationships: []
      }
      distributor_leads: {
        Row: DbDistributorLead
        Insert: DbDistributorLeadInsert
        Update: DbDistributorLeadUpdate
        Relationships: []
      }
    }
    Views: {
      v_active_catalog: {
        Row: {
          id: string
          product_key: string
          letter: string
          code: string
          name: string
          subtitle: string | null
          slug: string
          price: number
          compare_at_price: number | null
          gender: string
          model: string
          main_image: string | null
          stock: number
          is_featured: boolean
          variants: Json
        }
        Relationships: []
      }
    }
    Functions: Record<string, never>
  }
}
