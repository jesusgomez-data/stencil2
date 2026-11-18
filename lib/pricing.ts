export interface PriceCalculationItem {
  id: string
  price: number
  quantity: number
}

export interface PriceBreakdown {
  subtotal: number
  discount: number
  taxableBase: number
  tax: number
  shippingCost: number
  total: number
  pointsEarned: number
  isShippingFree: boolean
}

// PRUEBA1 deja el pedido en 1 € (para probar pagos reales). Solo se activa si
// NEXT_PUBLIC_ENABLE_TEST_PROMO=true; en producción debe quedar sin definir.
export const TEST_PROMO_ENABLED = process.env.NEXT_PUBLIC_ENABLE_TEST_PROMO === 'true'

export const VALID_PROMO_CODES: readonly string[] = TEST_PROMO_ENABLED
  ? ['S2-WELCOME10', 'S2-10OFF', 'S2-FREE', 'PRUEBA1']
  : ['S2-WELCOME10', 'S2-10OFF', 'S2-FREE']
export const FREE_SHIPPING_THRESHOLD = 50
export const STANDARD_SHIPPING_COST = 0
export const VAT_RATE = 0.21

export function calculateCartTotals(
  items: PriceCalculationItem[],
  promoCode?: string | null
): PriceBreakdown {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  
  const cleanCode = promoCode ? promoCode.trim().toUpperCase() : null
  let discount = 0

  if (cleanCode === 'S2-WELCOME10' || cleanCode === 'S2-10OFF') {
    discount = Number((subtotal * 0.1).toFixed(2))
  } else if (cleanCode === 'PRUEBA1' && TEST_PROMO_ENABLED) {
    discount = Math.max(0, Number((subtotal - 1.00).toFixed(2)))
  }

  const discountedSubtotal = Math.max(0, subtotal - discount)

  // Desglose de IVA 21% incluido en el precio final
  const taxableBase = Number((discountedSubtotal / (1 + VAT_RATE)).toFixed(2))
  const tax = Number((discountedSubtotal - taxableBase).toFixed(2))

  const isPromoFreeShipping = cleanCode === 'S2-FREE' || (cleanCode === 'PRUEBA1' && TEST_PROMO_ENABLED)
  const isShippingFree = items.length === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD || isPromoFreeShipping
  const shippingCost = items.length === 0 ? 0 : (isShippingFree ? 0 : STANDARD_SHIPPING_COST)

  const total = Number((discountedSubtotal + shippingCost).toFixed(2))
  const pointsEarned = Math.round(total)

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount,
    taxableBase,
    tax,
    shippingCost,
    total,
    pointsEarned,
    isShippingFree
  }
}
