import prisma from '~/server/utils/prisma'
import { verifyPassword, generateToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required'
    })
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password'
    })
  }

  // Verify password with HMAC-SHA512
  const isValid = verifyPassword(password, user.password)

  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password'
    })
  }

  // Generate JWT token (HS512)
  const token = generateToken({
    userId: user.id,
    username: user.username,
    email: user.email
  })

  // Set HTTP-only cookie
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })

  return {
    success: true,
    message: 'Login successful',
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  }
})
