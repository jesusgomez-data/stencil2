// Validación de entradas, honeypot anti-bots y limitador de peticiones por IP (sliding window).
// Se implementa en memoria sin dependencias externas (Upstash no está instalado en el proyecto),
// protegiendo las instancias activas en Vercel frente a ráfagas de spam con latencia cero.

export const FIELD_LIMITS = {
  email: 254,
  name: 120,
  messageMin: 5,
  messageMax: 4000,
  companyName: 150,
  phone: 40,
  notes: 2000,
  address: 250,
  city: 100,
  postalCode: 20,
  promoCode: 40,
  orderNumber: 64,
} as const

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (trimmed.length < 5 || trimmed.length > FIELD_LIMITS.email) return false
  if (/[\r\n\0]/.test(trimmed)) return false

  const atIndex = trimmed.indexOf('@')
  if (atIndex <= 0 || atIndex > 64) return false

  const domain = trimmed.slice(atIndex + 1)
  const lastDot = domain.lastIndexOf('.')
  if (lastDot <= 0 || domain.length - lastDot - 1 < 2) return false

  return EMAIL_REGEX.test(trimmed)
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

export function validateOptionalText(
  value: unknown,
  maxLength: number
): { valid: boolean; cleaned: string | undefined } {
  if (value === undefined || value === null || value === '') {
    return { valid: true, cleaned: undefined }
  }
  if (typeof value !== 'string') {
    return { valid: false, cleaned: undefined }
  }
  const trimmed = value.trim()
  if (trimmed.length > maxLength) {
    return { valid: false, cleaned: undefined }
  }
  return { valid: true, cleaned: trimmed || undefined }
}

export function isHoneypotTriggered(body: Record<string, unknown> | null | undefined): boolean {
  if (!body || typeof body !== 'object') return false
  const candidates = [body.website, body._gotcha, body.hp]
  return candidates.some((val) => typeof val === 'string' && val.trim().length > 0)
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = req.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp
  return '127.0.0.1'
}

type RateBucket = number[]
const rateLimitStore = new Map<string, RateBucket>()
const MAX_STORE_KEYS = 5000

export function checkRateLimit(
  req: Request,
  options: {
    namespace: string
    limit: number
    windowMs: number
  }
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now()
  const ip = getClientIp(req)
  const key = `${options.namespace}:${ip}`
  const cutoff = now - options.windowMs

  if (rateLimitStore.size > MAX_STORE_KEYS) {
    rateLimitStore.forEach((timestamps, k) => {
      const active = timestamps.filter((t: number) => t > cutoff)
      if (active.length === 0) {
        rateLimitStore.delete(k)
      } else {
        rateLimitStore.set(k, active)
      }
    })
  }

  const existing = rateLimitStore.get(key) || []
  const recent = existing.filter((t) => t > cutoff)

  if (recent.length >= options.limit) {
    const oldest = recent[0] ?? now
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + options.windowMs - now) / 1000))
    rateLimitStore.set(key, recent)
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    }
  }

  recent.push(now)
  rateLimitStore.set(key, recent)

  return {
    allowed: true,
    remaining: Math.max(0, options.limit - recent.length),
    retryAfterSeconds: 0,
  }
}
