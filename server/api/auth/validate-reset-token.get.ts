import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event)

  if (!token || typeof token !== 'string') {
    return { valid: false, message: 'Token tidak ditemukan' }
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token }
  })

  if (!record) {
    return { valid: false, message: 'Link reset password tidak valid' }
  }
  if (record.usedAt) {
    return { valid: false, message: 'Link reset password sudah pernah digunakan' }
  }
  if (record.expiresAt < new Date()) {
    return { valid: false, message: 'Link reset password sudah kadaluarsa' }
  }

  return { valid: true }
})
