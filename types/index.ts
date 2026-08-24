export type GlassesModel = 'wayfarer' | 'round' | 'shield' | 'aviator' | 'cat-eye' | 'sport'

export interface ProductColor {
  label: string
  hex: string
}

export interface Product {
  id: string
  letter: string
  code: string
  name: string
  price: number
  gender: 'men' | 'women' | 'unisex'
  model: GlassesModel
  slug: string
  description: string
  composition: string
  isFeatured?: boolean
  image: string
  gallery: string[]
  frameColor: string
  colors: ProductColor[]
}

export interface CartItem {
  id: string
  code: string
  name: string
  slug: string
  price: number
  image: string
  model: string
  color: string
  colorLabel: string
  quantity: number
}

export interface Order {
  id: string
  date: string
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  pointsEarned: number
  shippingAddress: {
    name: string
    address: string
    city: string
    postalCode: string
    email: string
    phone: string
  }
}

export interface CartContextType {
  cartItems: CartItem[]
  promoCode: string | null
  discount: number
  shippingCost: number
  subtotal: number
  total: number
  loyaltyPoints: number
  orders: Order[]
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeFromCart: (id: string, color: string) => void
  updateQuantity: (id: string, color: string, quantity: number) => void
  applyPromoCode: (code: string) => boolean
  removePromoCode: () => void
  clearCart: () => void
  completeCheckout: (shippingAddress: Order['shippingAddress']) => Order
}
