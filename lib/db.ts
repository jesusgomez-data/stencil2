import { supabaseServer } from '@/lib/supabaseClient'
import { PRODUCTS, getProductBySlug } from '@/lib/products'
import { VALID_PROMO_CODES } from '@/lib/pricing'
import { getModelGallery, getModelMainImage } from '@/lib/imageCatalog'
import type { CartItem, Order, Product } from '@/types'
import type {
  DbProduct,
  DbProfile,
  DbOrder,
  DbPromoCode,
  OrderItemJson,
  OrderStatus,
  ShippingAddressJson,
} from '@/types/database'

function computeTier(points: number): DbProfile['tier'] {
  if (points >= 500) return 'vip'
  if (points >= 250) return 'gold'
  if (points >= 100) return 'silver'
  return 'member'
}

function mapDbProductToProduct(row: DbProduct): Product {
  const gallery =
    Array.isArray(row.gallery) && row.gallery.length > 0
      ? row.gallery
      : getModelGallery(row.letter)
  const image = row.main_image || getModelMainImage(row.letter)

  return {
    id: row.product_key,
    letter: row.letter,
    code: row.code,
    name: row.name,
    subtitle: row.subtitle ?? undefined,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : undefined,
    gender: row.gender,
    model: row.model,
    slug: row.slug,
    aliases: row.aliases ?? [],
    description: row.description ?? '',
    composition: row.composition ?? '',
    isFeatured: row.is_featured,
    image,
    gallery,
    frameColor: row.frame_color ?? '#1a1a1a',
    colors: Array.isArray(row.colors) ? row.colors : [],
    glassesColor: row.glasses_color ?? undefined,
    frameType: row.frame_type ?? undefined,
    logo: row.logo ?? undefined,
    material: row.material ?? undefined,
    lens: row.lens ?? undefined,
    sizes:
      row.sizes &&
      row.sizes.varillas &&
      row.sizes.puente &&
      row.sizes.frontal &&
      row.sizes.altura
        ? {
            varillas: row.sizes.varillas,
            puente: row.sizes.puente,
            frontal: row.sizes.frontal,
            altura: row.sizes.altura,
          }
        : undefined,
  }
}

function mapDbOrderToOrder(row: DbOrder): Order {
  const items: CartItem[] = Array.isArray(row.items)
    ? row.items.map((item) => ({
        id: item.id || item.slug,
        code: item.code || '',
        name: item.name,
        slug: item.slug,
        price: Number(item.price) || 0,
        image: item.image || '',
        model: item.model || 'wayfarer',
        color: item.color || '#1a1a1a',
        colorLabel: item.colorLabel || 'Estándar',
        quantity: Number(item.quantity) || 1,
      }))
    : []

  return {
    id: row.order_number,
    date: new Date(row.created_at).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    items,
    subtotal: Number(row.subtotal) || 0,
    discount: Number(row.discount) || 0,
    tax: Number(row.tax) || 0,
    shipping: Number(row.shipping) || 0,
    total: Number(row.total) || 0,
    pointsEarned: Number(row.points_earned) || 0,
    stripeId: row.stripe_id ?? undefined,
    shippingAddress: {
      name: row.shipping_address?.name || row.customer_name || '',
      address: row.shipping_address?.address || '',
      city: row.shipping_address?.city || '',
      postalCode: row.shipping_address?.postalCode || '',
      email: row.shipping_address?.email || row.customer_email,
      phone: row.shipping_address?.phone || row.customer_phone || '',
    },
  }
}

export async function getProductsFromDb(): Promise<{
  products: Product[]
  source: 'supabase' | 'fallback'
}> {
  if (!supabaseServer) {
    return { products: PRODUCTS, source: 'fallback' }
  }

  try {
    const { data, error } = await supabaseServer
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: true })

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn('[DB getProductsFromDb] Fallback al catálogo local:', error.message)
      }
      return { products: PRODUCTS, source: 'fallback' }
    }

    return {
      products: data.map(mapDbProductToProduct),
      source: 'supabase',
    }
  } catch (err) {
    console.warn('[DB getProductsFromDb] Excepción, usando catálogo local:', err)
    return { products: PRODUCTS, source: 'fallback' }
  }
}

export async function getProductBySlugFromDb(slug: string): Promise<{
  product: Product | undefined
  source: 'supabase' | 'fallback'
}> {
  if (!supabaseServer) {
    return { product: getProductBySlug(slug), source: 'fallback' }
  }

  try {
    const { data, error } = await supabaseServer
      .from('products')
      .select('*')
      .eq('is_active', true)
      .or(`slug.eq.${slug},aliases.cs.{${slug}}`)
      .limit(1)
      .maybeSingle()

    if (error || !data) {
      return { product: getProductBySlug(slug), source: 'fallback' }
    }

    return {
      product: mapDbProductToProduct(data),
      source: 'supabase',
    }
  } catch {
    return { product: getProductBySlug(slug), source: 'fallback' }
  }
}

export async function getProfileByEmailFromDb(email: string): Promise<DbProfile | null> {
  const normalizedEmail = email.trim().toLowerCase()
  if (!supabaseServer || !normalizedEmail) return null

  try {
    const { data, error } = await supabaseServer
      .from('profiles')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (error) {
      console.warn('[DB getProfileByEmailFromDb]:', error.message)
      return null
    }

    return data
  } catch (err) {
    console.warn('[DB getProfileByEmailFromDb] Excepción:', err)
    return null
  }
}

export async function upsertProfileInDb(input: {
  email: string
  fullName?: string | null
  phone?: string | null
  defaultShippingAddress?: ShippingAddressJson
}): Promise<{ profile: DbProfile | null; persisted: boolean; error?: string }> {
  const normalizedEmail = input.email.trim().toLowerCase()
  if (!normalizedEmail) {
    return { profile: null, persisted: false, error: 'Email requerido' }
  }
  if (!supabaseServer) {
    return { profile: null, persisted: false, error: 'Supabase no configurado' }
  }

  try {
    const existing = await getProfileByEmailFromDb(normalizedEmail)
    if (existing) {
      const nextPoints = existing.loyalty_points ?? 0
      const { data, error } = await supabaseServer
        .from('profiles')
        .update({
          full_name: input.fullName !== undefined ? input.fullName : existing.full_name,
          phone: input.phone !== undefined ? input.phone : existing.phone,
          default_shipping_address:
            input.defaultShippingAddress !== undefined
              ? input.defaultShippingAddress
              : existing.default_shipping_address,
          tier: computeTier(nextPoints),
        })
        .eq('id', existing.id)
        .select('*')
        .single()

      if (error) {
        console.warn('[DB upsertProfileInDb] Update error:', error.message)
        return { profile: null, persisted: false, error: error.message }
      }
      return { profile: data, persisted: true }
    }

    const { data, error } = await supabaseServer
      .from('profiles')
      .insert({
        email: normalizedEmail,
        full_name: input.fullName ?? null,
        phone: input.phone ?? null,
        default_shipping_address: input.defaultShippingAddress ?? {},
        loyalty_points: 0,
        tier: 'member',
        role: 'customer',
      })
      .select('*')
      .single()

    if (error) {
      console.warn('[DB upsertProfileInDb] Insert error:', error.message)
      return { profile: null, persisted: false, error: error.message }
    }

    return { profile: data, persisted: true }
  } catch (err: any) {
    console.warn('[DB upsertProfileInDb] Excepción:', err)
    return { profile: null, persisted: false, error: err?.message }
  }
}

async function creditOrderPointsOnce(params: {
  orderId: string
  orderNumber: string
  customerId: string | null
  customerEmail: string
  pointsEarned: number
}): Promise<void> {
  if (!supabaseServer || params.pointsEarned <= 0 || !params.customerEmail) return

  try {
    const { data: existingTx } = await supabaseServer
      .from('loyalty_transactions')
      .select('id')
      .eq('order_id', params.orderId)
      .gt('points_delta', 0)
      .maybeSingle()

    if (existingTx) return

    let profile = await getProfileByEmailFromDb(params.customerEmail)
    if (!profile) {
      const created = await upsertProfileInDb({ email: params.customerEmail })
      profile = created.profile
    }
    if (!profile) return

    const nextPoints = (profile.loyalty_points || 0) + params.pointsEarned
    await supabaseServer
      .from('profiles')
      .update({
        loyalty_points: nextPoints,
        tier: computeTier(nextPoints),
      })
      .eq('id', profile.id)

    await supabaseServer.from('loyalty_transactions').insert({
      customer_id: profile.id,
      customer_email: params.customerEmail.toLowerCase(),
      order_id: params.orderId,
      points_delta: params.pointsEarned,
      reason: `Compra pedido ${params.orderNumber}`,
    })
  } catch (err) {
    console.warn('[DB creditOrderPointsOnce] No se pudieron acreditar puntos:', err)
  }
}

export interface CreateOrderPayload {
  orderNumber: string
  customerEmail: string
  customerName?: string | null
  customerPhone?: string | null
  stripeId?: string | null
  status?: OrderStatus
  items: OrderItemJson[]
  subtotal: number
  discount: number
  taxableBase: number
  tax: number
  shipping: number
  total: number
  promoCode?: string | null
  pointsEarned?: number
  shippingAddress?: ShippingAddressJson
  notes?: string | null
}

export async function createOrderInDb(payload: CreateOrderPayload): Promise<{
  order: DbOrder | null
  persisted: boolean
  error?: string
}> {
  if (!supabaseServer) {
    return { order: null, persisted: false, error: 'Supabase no configurado' }
  }

  const normalizedEmail = payload.customerEmail.trim().toLowerCase()

  try {
    const profileRes = await upsertProfileInDb({
      email: normalizedEmail,
      fullName: payload.customerName ?? payload.shippingAddress?.name ?? null,
      phone: payload.customerPhone ?? payload.shippingAddress?.phone ?? null,
      defaultShippingAddress: payload.shippingAddress,
    })

    const customerId = profileRes.profile?.id ?? null

    const { data: existingByNumber } = await supabaseServer
      .from('orders')
      .select('*')
      .eq('order_number', payload.orderNumber)
      .maybeSingle()

    let savedOrder: DbOrder | null = null

    if (existingByNumber) {
      const { data, error } = await supabaseServer
        .from('orders')
        .update({
          customer_id: customerId ?? existingByNumber.customer_id,
          customer_email: normalizedEmail,
          customer_name: payload.customerName ?? existingByNumber.customer_name,
          customer_phone: payload.customerPhone ?? existingByNumber.customer_phone,
          stripe_id: payload.stripeId ?? existingByNumber.stripe_id,
          status: payload.status ?? existingByNumber.status,
          items: payload.items.length > 0 ? payload.items : existingByNumber.items,
          subtotal: payload.subtotal,
          discount: payload.discount,
          taxable_base: payload.taxableBase,
          tax: payload.tax,
          shipping: payload.shipping,
          total: payload.total,
          promo_code: payload.promoCode ?? existingByNumber.promo_code,
          points_earned: payload.pointsEarned ?? existingByNumber.points_earned,
          shipping_address: payload.shippingAddress ?? existingByNumber.shipping_address,
          notes: payload.notes ?? existingByNumber.notes,
        })
        .eq('id', existingByNumber.id)
        .select('*')
        .single()

      if (error) {
        console.warn('[DB createOrderInDb] Update error:', error.message)
        return { order: null, persisted: false, error: error.message }
      }
      savedOrder = data
    } else {
      const { data, error } = await supabaseServer
        .from('orders')
        .insert({
          order_number: payload.orderNumber,
          customer_id: customerId,
          customer_email: normalizedEmail,
          customer_name: payload.customerName ?? payload.shippingAddress?.name ?? null,
          customer_phone: payload.customerPhone ?? payload.shippingAddress?.phone ?? null,
          stripe_id: payload.stripeId ?? null,
          status: payload.status ?? 'pending',
          items: payload.items,
          subtotal: payload.subtotal,
          discount: payload.discount,
          taxable_base: payload.taxableBase,
          tax: payload.tax,
          shipping: payload.shipping,
          total: payload.total,
          promo_code: payload.promoCode ?? null,
          points_earned: payload.pointsEarned ?? Math.round(payload.total),
          shipping_address: payload.shippingAddress ?? {},
          notes: payload.notes ?? null,
        })
        .select('*')
        .single()

      if (error) {
        console.warn('[DB createOrderInDb] Insert error:', error.message)
        return { order: null, persisted: false, error: error.message }
      }
      savedOrder = data
    }

    if (savedOrder && payload.items.length > 0) {
      const { data: existingItems } = await supabaseServer
        .from('order_items')
        .select('id')
        .eq('order_id', savedOrder.id)
        .limit(1)

      if (!existingItems || existingItems.length === 0) {
        const { data: dbProducts } = await supabaseServer
          .from('products')
          .select('id, product_key, slug')

        const productMap = new Map<string, string>()
        if (dbProducts) {
          for (const p of dbProducts) {
            productMap.set(p.slug, p.id)
            productMap.set(p.product_key, p.id)
          }
        }

        const itemRows = payload.items.map((item) => ({
          order_id: savedOrder!.id,
          product_id: productMap.get(item.slug) ?? productMap.get(item.id) ?? null,
          product_slug: item.slug || item.id,
          product_code: item.code || null,
          product_name: item.name,
          model: item.model || null,
          color_hex: item.color || null,
          color_label: item.colorLabel || null,
          unit_price: Number(item.price),
          quantity: Number(item.quantity),
          line_total: Number((Number(item.price) * Number(item.quantity)).toFixed(2)),
          image: item.image || null,
        }))

        const { error: itemsErr } = await supabaseServer.from('order_items').insert(itemRows)
        if (itemsErr) {
          console.warn('[DB createOrderInDb] Error insertando order_items:', itemsErr.message)
        }
      }
    }

    if (savedOrder && savedOrder.status === 'paid') {
      await creditOrderPointsOnce({
        orderId: savedOrder.id,
        orderNumber: savedOrder.order_number,
        customerId: savedOrder.customer_id,
        customerEmail: normalizedEmail,
        pointsEarned: savedOrder.points_earned,
      })
    }

    return { order: savedOrder, persisted: true }
  } catch (err: any) {
    console.warn('[DB createOrderInDb] Excepción:', err)
    return { order: null, persisted: false, error: err?.message }
  }
}

export async function orderExistsInDb(orderNumber: string): Promise<boolean> {
  if (!supabaseServer || !orderNumber) return false
  const { data } = await supabaseServer
    .from('orders')
    .select('id')
    .eq('order_number', orderNumber)
    .maybeSingle()
  return Boolean(data)
}

export async function markOrderPaidInDb(
  stripeId: string,
  payload: {
    orderNumber?: string
    customerEmail?: string
    customerName?: string
    promoCode?: string | null
    subtotal?: number
    discount?: number
    taxableBase?: number
    tax?: number
    shipping?: number
    total?: number
    pointsEarned?: number
  }
): Promise<{ order: DbOrder | null; persisted: boolean; error?: string }> {
  if (!supabaseServer) {
    return { order: null, persisted: false, error: 'Supabase no configurado' }
  }

  try {
    let existing: DbOrder | null = null

    const { data: byStripe } = await supabaseServer
      .from('orders')
      .select('*')
      .eq('stripe_id', stripeId)
      .maybeSingle()

    existing = byStripe

    if (!existing && payload.orderNumber) {
      const { data: byOrderNum } = await supabaseServer
        .from('orders')
        .select('*')
        .eq('order_number', payload.orderNumber)
        .maybeSingle()
      existing = byOrderNum
    }

    const effectiveTotal = payload.total ?? existing?.total ?? 0
    const effectivePoints = payload.pointsEarned ?? existing?.points_earned ?? Math.round(Number(effectiveTotal))
    const effectiveEmail = (payload.customerEmail || existing?.customer_email || '').trim().toLowerCase()

    if (existing) {
      const { data, error } = await supabaseServer
        .from('orders')
        .update({
          stripe_id: stripeId,
          status: 'paid',
          total: effectiveTotal,
          subtotal: payload.subtotal ?? existing.subtotal,
          discount: payload.discount ?? existing.discount,
          taxable_base: payload.taxableBase ?? existing.taxable_base,
          tax: payload.tax ?? existing.tax,
          shipping: payload.shipping ?? existing.shipping,
          promo_code: payload.promoCode !== undefined ? payload.promoCode : existing.promo_code,
          points_earned: effectivePoints,
        })
        .eq('id', existing.id)
        .select('*')
        .single()

      if (error) {
        return { order: null, persisted: false, error: error.message }
      }

      if (effectiveEmail) {
        await creditOrderPointsOnce({
          orderId: data.id,
          orderNumber: data.order_number,
          customerId: data.customer_id,
          customerEmail: effectiveEmail,
          pointsEarned: effectivePoints,
        })
      }

      return { order: data, persisted: true }
    }

    const fallbackOrderNum = payload.orderNumber || `S2-ORD-${Date.now()}`
    const fallbackEmail = effectiveEmail || 'cliente@stencil2.com'

    return createOrderInDb({
      orderNumber: fallbackOrderNum,
      customerEmail: fallbackEmail,
      customerName: payload.customerName ?? null,
      stripeId,
      status: 'paid',
      items: [],
      subtotal: payload.subtotal ?? effectiveTotal,
      discount: payload.discount ?? 0,
      taxableBase: payload.taxableBase ?? 0,
      tax: payload.tax ?? 0,
      shipping: payload.shipping ?? 0,
      total: effectiveTotal,
      promoCode: payload.promoCode ?? null,
      pointsEarned: effectivePoints,
    })
  } catch (err: any) {
    console.warn('[DB markOrderPaidInDb] Excepción:', err)
    return { order: null, persisted: false, error: err?.message }
  }
}

export async function getOrdersByEmailFromDb(email: string): Promise<{
  orders: Order[]
  source: 'supabase' | 'fallback'
}> {
  const normalizedEmail = email.trim().toLowerCase()
  if (!supabaseServer || !normalizedEmail) {
    return { orders: [], source: 'fallback' }
  }

  try {
    const { data, error } = await supabaseServer
      .from('orders')
      .select('*')
      .eq('customer_email', normalizedEmail)
      .order('created_at', { ascending: false })

    if (error || !data) {
      if (error) {
        console.warn('[DB getOrdersByEmailFromDb]:', error.message)
      }
      return { orders: [], source: 'fallback' }
    }

    return {
      orders: data.map(mapDbOrderToOrder),
      source: 'supabase',
    }
  } catch {
    return { orders: [], source: 'fallback' }
  }
}

export async function redeemLoyaltyPointsInDb(
  email: string,
  pointsNeeded: number,
  rewardCode: string
): Promise<{
  ok: boolean
  loyaltyPoints?: number
  code?: string
  persisted: boolean
  error?: string
}> {
  const normalizedEmail = email.trim().toLowerCase()
  if (!supabaseServer || !normalizedEmail) {
    return { ok: false, persisted: false, error: 'Supabase no configurado o email vacío' }
  }

  try {
    const profile = await getProfileByEmailFromDb(normalizedEmail)
    if (!profile) {
      return { ok: false, persisted: false, error: 'Perfil no encontrado' }
    }
    if (profile.loyalty_points < pointsNeeded) {
      return { ok: false, persisted: true, error: 'Puntos insuficientes' }
    }

    const nextPoints = profile.loyalty_points - pointsNeeded
    const { error: updateErr } = await supabaseServer
      .from('profiles')
      .update({
        loyalty_points: nextPoints,
        tier: computeTier(nextPoints),
      })
      .eq('id', profile.id)

    if (updateErr) {
      return { ok: false, persisted: false, error: updateErr.message }
    }

    await supabaseServer.from('loyalty_transactions').insert({
      customer_id: profile.id,
      customer_email: normalizedEmail,
      points_delta: -pointsNeeded,
      reason: `Canje recompensa ${rewardCode}`,
      reward_code: rewardCode,
    })

    return {
      ok: true,
      loyaltyPoints: nextPoints,
      code: rewardCode,
      persisted: true,
    }
  } catch (err: any) {
    return { ok: false, persisted: false, error: err?.message }
  }
}

export async function validatePromoCodeInDb(code: string): Promise<{
  valid: boolean
  promo?: DbPromoCode
  source: 'supabase' | 'fallback'
}> {
  const cleanCode = code.trim().toUpperCase()
  if (!cleanCode) return { valid: false, source: 'fallback' }

  if (!supabaseServer) {
    const valid = (VALID_PROMO_CODES as readonly string[]).includes(cleanCode)
    return { valid, source: 'fallback' }
  }

  try {
    const { data, error } = await supabaseServer
      .from('promo_codes')
      .select('*')
      .eq('code', cleanCode)
      .eq('is_active', true)
      .maybeSingle()

    if (error || !data) {
      const valid = (VALID_PROMO_CODES as readonly string[]).includes(cleanCode)
      return { valid, source: 'fallback' }
    }

    if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) {
      return { valid: false, source: 'supabase' }
    }
    if (data.max_uses != null && data.used_count >= data.max_uses) {
      return { valid: false, source: 'supabase' }
    }

    return { valid: true, promo: data, source: 'supabase' }
  } catch {
    const valid = (VALID_PROMO_CODES as readonly string[]).includes(cleanCode)
    return { valid, source: 'fallback' }
  }
}

export async function subscribeNewsletterInDb(
  email: string,
  source: string = 'footer'
): Promise<{
  ok: boolean
  promoCode: string
  persisted: boolean
  alreadySubscribed?: boolean
  error?: string
}> {
  const normalizedEmail = email.trim().toLowerCase()
  const promoCode = 'S2-WELCOME10'

  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return { ok: false, promoCode, persisted: false, error: 'Email inválido' }
  }

  if (!supabaseServer) {
    return { ok: true, promoCode, persisted: false }
  }

  try {
    const { data: existing } = await supabaseServer
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', normalizedEmail)
      .maybeSingle()

    const { error } = await supabaseServer.from('newsletter_subscribers').upsert(
      {
        email: normalizedEmail,
        promo_code_sent: promoCode,
        privacy_accepted: true,
        is_active: true,
        source,
      },
      { onConflict: 'email' }
    )

    if (error) {
      console.warn('[DB subscribeNewsletterInDb]:', error.message)
      return { ok: true, promoCode, persisted: false, error: error.message }
    }

    return {
      ok: true,
      promoCode,
      persisted: true,
      alreadySubscribed: Boolean(existing?.is_active),
    }
  } catch (err: any) {
    return { ok: true, promoCode, persisted: false, error: err?.message }
  }
}

export async function createContactMessageInDb(input: {
  email: string
  name?: string
  message: string
  privacyAccepted: boolean
}): Promise<{ ok: boolean; persisted: boolean; id?: string; error?: string }> {
  const normalizedEmail = input.email.trim().toLowerCase()
  if (!normalizedEmail || !input.message.trim()) {
    return { ok: false, persisted: false, error: 'Email y mensaje son obligatorios' }
  }
  if (!input.privacyAccepted) {
    return { ok: false, persisted: false, error: 'Debes aceptar la Política de Privacidad' }
  }

  if (!supabaseServer) {
    return { ok: true, persisted: false }
  }

  try {
    const { data, error } = await supabaseServer
      .from('contact_messages')
      .insert({
        email: normalizedEmail,
        name: input.name?.trim() || null,
        message: input.message.trim(),
        privacy_accepted: input.privacyAccepted,
        status: 'new',
      })
      .select('id')
      .single()

    if (error) {
      console.warn('[DB createContactMessageInDb]:', error.message)
      return { ok: true, persisted: false, error: error.message }
    }

    return { ok: true, persisted: true, id: data.id }
  } catch (err: any) {
    return { ok: true, persisted: false, error: err?.message }
  }
}

export async function createDistributorLeadInDb(input: {
  email: string
  companyName?: string
  phone?: string
  notes?: string
  privacyAccepted: boolean
}): Promise<{ ok: boolean; persisted: boolean; id?: string; error?: string }> {
  const normalizedEmail = input.email.trim().toLowerCase()
  if (!normalizedEmail) {
    return { ok: false, persisted: false, error: 'Email obligatorio' }
  }
  if (!input.privacyAccepted) {
    return { ok: false, persisted: false, error: 'Debes aceptar la Política de Privacidad' }
  }

  if (!supabaseServer) {
    return { ok: true, persisted: false }
  }

  try {
    const { data, error } = await supabaseServer
      .from('distributor_leads')
      .insert({
        email: normalizedEmail,
        company_name: input.companyName?.trim() || null,
        phone: input.phone?.trim() || null,
        notes: input.notes?.trim() || null,
        privacy_accepted: input.privacyAccepted,
        status: 'pending',
      })
      .select('id')
      .single()

    if (error) {
      console.warn('[DB createDistributorLeadInDb]:', error.message)
      return { ok: true, persisted: false, error: error.message }
    }

    return { ok: true, persisted: true, id: data.id }
  } catch (err: any) {
    return { ok: true, persisted: false, error: err?.message }
  }
}
