import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import type { H3Event } from 'h3'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-please-change'
const APP_PASSWORD = process.env.APP_PASSWORD || 'admin123'

export interface JWTPayload {
  authenticated: boolean
  iat?: number
  exp?: number
}

/**
 * Verify password against environment variable
 */
export async function verifyPassword(password: string): Promise<boolean> {
  try {
    // For simplicity, we're doing a direct comparison
    // In production, you might want to hash the password in .env
    return password === APP_PASSWORD
  } catch (error) {
    return false
  }
}

/**
 * Generate JWT token
 */
export function generateToken(): string {
  const payload: JWTPayload = {
    authenticated: true
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d' // Token valid for 7 days
  })
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * Get token from cookies or headers
 */
export function getTokenFromRequest(event: H3Event): string | null {
  // Check cookie first
  const cookieToken = getCookie(event, 'auth_token')
  if (cookieToken) return cookieToken

  // Check Authorization header
  const authHeader = getHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(event: H3Event): boolean {
  const token = getTokenFromRequest(event)
  if (!token) return false

  const payload = verifyToken(token)
  return payload !== null && payload.authenticated === true
}

/**
 * Require authentication middleware
 */
export function requireAuth(event: H3Event) {
  if (!isAuthenticated(event)) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }
}
