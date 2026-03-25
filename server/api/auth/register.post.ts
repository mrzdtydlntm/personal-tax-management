import prisma from '~/server/utils/prisma'
import { hashPassword, generateToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, email, password } = body

  if (!username || !email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Username, email, and password are required'
    })
  }

  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      message: 'Password must be at least 8 characters'
    })
  }

  // Check if username or email already exists
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username.trim() },
        { email: email.trim().toLowerCase() }
      ]
    }
  })

  if (existing) {
    throw createError({
      statusCode: 409,
      message: existing.email === email.trim().toLowerCase()
        ? 'Email already registered'
        : 'Username already taken'
    })
  }

  // Hash password with HMAC-SHA512
  const hashedPassword = hashPassword(password)

  // Create user
  const user = await prisma.user.create({
    data: {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword
    }
  })

  // Generate JWT token
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
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })

  return {
    success: true,
    message: 'Registration successful',
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  }
})
