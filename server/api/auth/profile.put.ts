import prisma from '~/server/utils/prisma'
import { requireAuth, generateToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const { username, email } = await readBody(event)

  if (!username || !email) {
    throw createError({ statusCode: 400, message: 'Username dan email wajib diisi' })
  }

  const trimmedUsername = username.trim()
  const trimmedEmail = email.trim().toLowerCase()

  if (trimmedUsername.length < 3) {
    throw createError({ statusCode: 400, message: 'Username minimal 3 karakter' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    throw createError({ statusCode: 400, message: 'Format email tidak valid' })
  }

  // Check uniqueness excluding self
  const conflict = await prisma.user.findFirst({
    where: {
      AND: [
        { id: { not: userId } },
        { OR: [{ username: trimmedUsername }, { email: trimmedEmail }] }
      ]
    }
  })

  if (conflict) {
    throw createError({
      statusCode: 409,
      message: conflict.email === trimmedEmail ? 'Email sudah digunakan' : 'Username sudah digunakan'
    })
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { username: trimmedUsername, email: trimmedEmail }
  })

  // Re-issue JWT with updated data
  const token = generateToken({ userId: user.id, username: user.username, email: user.email })
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })

  return { success: true, user: { username: user.username, email: user.email } }
})
