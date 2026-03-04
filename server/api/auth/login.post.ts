import { verifyPassword, generateToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { password } = body

  if (!password) {
    throw createError({
      statusCode: 400,
      message: 'Password is required'
    })
  }

  const isValid = await verifyPassword(password)

  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: 'Invalid password'
    })
  }

  // Generate JWT token
  const token = generateToken()

  // Set HTTP-only cookie for security
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })

  return {
    success: true,
    message: 'Login successful',
    token
  }
})
