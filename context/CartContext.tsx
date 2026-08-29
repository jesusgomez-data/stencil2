'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

import { CartItem, Order, CartContextType } from '@/types'

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0)
  const [orders, setOrders] = useState<Order[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Load cart, points, and orders from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('stencil2_cart')
      const storedPoints = localStorage.getItem('stencil2_points')
      const storedOrders = localStorage.getItem('stencil2_orders')

      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart))
        } catch (e) {
          console.error('Error parsing cart from localStorage', e)
        }
      }
      if (storedPoints) {
        setLoyaltyPoints(parseInt(storedPoints, 10))
      }
      if (storedOrders) {
        try {
          setOrders(JSON.parse(storedOrders))
        } catch (e) {
          console.error('Error parsing orders from localStorage', e)
        }
      }
      setIsMounted(true)
    }
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('stencil2_cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isMounted])

  // Save points to localStorage when they change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('stencil2_points', loyaltyPoints.toString())
    }
  }, [loyaltyPoints, isMounted])

  // Save orders to localStorage when they change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('stencil2_orders', JSON.stringify(orders))
    }
  }, [orders, isMounted])

  // Calculate pricing
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  // Descuentos soportados:
  // S2-WELCOME10: 10% de descuento
  // S2-10OFF: 10% de descuento
  // S2-FREE: Envío gratuito sin importar total
  let discount = 0
  if (promoCode === 'S2-WELCOME10' || promoCode === 'S2-10OFF') {
    discount = subtotal * 0.1
  }

  const taxableAmount = Math.max(0, subtotal - discount)
  // IVA 21% automático sobre la base imponible
  const tax = taxableAmount * 0.21

  const promoFreeShipping = promoCode === 'S2-FREE'
  const isShippingFree = (taxableAmount >= 50) || promoFreeShipping
  const shippingCost = cartItems.length === 0 ? 0 : (isShippingFree ? 0 : 4.95)

  const total = taxableAmount + tax + shippingCost

  const addToCart = (newItem: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === newItem.id && item.color === newItem.color
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems]
        const currentQty = updatedItems[existingItemIndex].quantity
        // Cap quantity at 10
        updatedItems[existingItemIndex].quantity = Math.min(10, currentQty + quantity)
        return updatedItems
      } else {
        return [...prevItems, { ...newItem, quantity }]
      }
    })
  }

  const removeFromCart = (id: string, color: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.color === color))
    )
  }

  const updateQuantity = (id: string, color: string, quantity: number) => {
    if (quantity < 1 || quantity > 10) return
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.color === color ? { ...item, quantity } : item
      )
    )
  }

  const applyPromoCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase()
    if (['S2-WELCOME10', 'S2-10OFF', 'S2-FREE'].includes(cleanCode)) {
      setPromoCode(cleanCode)
      return true
    }
    return false
  }

  const removePromoCode = () => {
    setPromoCode(null)
  }

  const clearCart = () => {
    setCartItems([])
    setPromoCode(null)
  }

  const completeCheckout = (shippingAddress: Order['shippingAddress']): Order => {
    const pointsEarned = Math.round(total)
    const newOrder: Order = {
      id: `S2-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      items: [...cartItems],
      subtotal,
      discount,
      tax,
      shipping: shippingCost,
      total,
      pointsEarned,
      shippingAddress,
    }

    setOrders((prevOrders) => [newOrder, ...prevOrders])
    setLoyaltyPoints((prevPoints) => prevPoints + pointsEarned)
    clearCart()

    return newOrder
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        promoCode,
        discount,
        tax,
        shippingCost,
        subtotal,
        total,
        loyaltyPoints,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyPromoCode,
        removePromoCode,
        clearCart,
        completeCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
