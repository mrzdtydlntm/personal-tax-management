import crypto from 'crypto'
import prisma from '~/server/utils/prisma'
import { sendResetPasswordEmail } from '~/server/utils/mailer'

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  if (!email) {
    throw createError({ statusCode: 400, message: 'Email is required' })
  }

  // Always return the same response to prevent user enumeration
  const genericResponse = {
    message: 'Jika email terdaftar, link reset password telah dikirim.'
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return genericResponse
  }

  // Invalidate any existing unused tokens for this user
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() }
  })

  // Generate a cryptographically secure token
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt }
  })

  await sendResetPasswordEmail(user.email, user.username, token)

  return genericResponse
})
