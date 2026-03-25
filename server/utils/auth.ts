import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import type { H3Event } from 'h3'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-please-change'
const HASH_SECRET = process.env.HASH_SECRET || JWT_SECRET

export interface JWTPayload {
  userId: string
  username: string
  email: string
  iat?: number
  exp?: number
}

/**
 * Hash password using HMAC-SHA512
 */
export function hashPassword(password: string): string {
  return crypto
    .createHmac('sha512', HASH_SECRET)
    .update(password)
    .digest('hex')
}

/**
 * Verify password against stored hash using timing-safe comparison
 */
export function verifyPassword(password: string, hash: string): boolean {
  const inputHash = hashPassword(password)
  try {
    return crypto.timingSafeEqual(
      Buffer.from(inputHash, 'hex'),
      Buffer.from(hash, 'hex')
    )
  } catch {
    return false
  }
}

/**
 * Generate JWT token signed with HS512
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS512',
    expiresIn: '7d'
  })
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS512'] }) as JWTPayload
  } catch {
    return null
  }
}

/**
 * Get token from cookies or Authorization header
 */
export function getTokenFromRequest(event: H3Event): string | null {
  const cookieToken = getCookie(event, 'auth_token')
  if (cookieToken) return cookieToken

  const authHeader = getHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

/**
 * Get authenticated user payload from request
 */
export function getAuthUser(event: H3Event): JWTPayload | null {
  const token = getTokenFromRequest(event)
  if (!token) return null
  return verifyToken(token)
}

/**
 * Require authentication and return user payload, throws 401 if not authenticated
 */
export function requireAuth(event: H3Event): JWTPayload {
  const user = getAuthUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }
  return user
}

/**
 * Check if request is authenticated
 */
export function isAuthenticated(event: H3Event): boolean {
  return getAuthUser(event) !== null
}
