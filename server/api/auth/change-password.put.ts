import prisma from '~/server/utils/prisma'
import { requireAuth, hashPassword, verifyPassword } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const { currentPassword, newPassword, confirmPassword } = await readBody(event)

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw createError({ statusCode: 400, message: 'Semua field password wajib diisi' })
  }

  if (newPassword !== confirmPassword) {
    throw createError({ statusCode: 400, message: 'Password baru dan konfirmasi tidak cocok' })
  }

  if (newPassword.length < 8) {
    throw createError({ statusCode: 400, message: 'Password baru minimal 8 karakter' })
  }

  if (currentPassword === newPassword) {
    throw createError({ statusCode: 400, message: 'Password baru tidak boleh sama dengan password lama' })
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw createError({ statusCode: 404, message: 'User tidak ditemukan' })
  }

  if (!verifyPassword(currentPassword, user.password)) {
    throw createError({ statusCode: 400, message: 'Password saat ini tidak benar' })
  }

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashPassword(newPassword) }
  })

  return { success: true, message: 'Password berhasil diubah' }
})
