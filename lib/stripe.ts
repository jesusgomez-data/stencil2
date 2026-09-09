import Stripe from 'stripe'
import { loadStripe, Stripe as StripeClient } from '@stripe/stripe-js'

// Server-side Stripe client singleton
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
      typescript: true,
      appInfo: {
        name: 'STENCIL2 Ecommerce',
        version: '1.0.0',
      },
    })
  : null

export const isStripeConfigured = (): boolean => {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    !process.env.STRIPE_SECRET_KEY.includes('pon_aqui') &&
    !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('pon_aqui')
  )
}

// Client-side Stripe loader singleton
let stripePromise: Promise<StripeClient | null> | null = null

export const getStripe = (): Promise<StripeClient | null> | null => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!publishableKey || publishableKey.trim() === '') {
    return null
  }
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}
