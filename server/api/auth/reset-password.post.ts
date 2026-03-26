import prisma from '~/server/utils/prisma'
import { hashPassword } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { token, newPassword, confirmPassword } = await readBody(event)

  if (!token || !newPassword || !confirmPassword) {
    throw createError({ statusCode: 400, message: 'Token, password baru, dan konfirmasi password wajib diisi' })
  }

  if (newPassword !== confirmPassword) {
    throw createError({ statusCode: 400, message: 'Password baru dan konfirmasi password tidak cocok' })
  }

  if (newPassword.length < 8) {
    throw createError({ statusCode: 400, message: 'Password minimal 8 karakter' })
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token }
  })

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw createError({ statusCode: 400, message: 'Link reset password tidak valid atau sudah kadaluarsa' })
  }

  const hashedPassword = hashPassword(newPassword)

  // Update password and mark token as used in a transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { password: hashedPassword }
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() }
    })
  ])

  return { message: 'Password berhasil diubah. Silakan login dengan password baru Anda.' }
})
