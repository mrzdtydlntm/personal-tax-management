import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // 1. Authenticate Request
  const { userId } = requireAuth(event)

  try {
    // 2. Delete the user (this cascades to related models)
    await prisma.user.delete({
      where: { id: userId }
    })

    // 3. Clear auth token cookie (logout behavior)
    setCookie(event, 'auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    // 4. Return success
    return {
      success: true,
      message: 'Akun berhasil dihapus'
    }
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({ statusCode: 404, message: 'User tidak ditemukan' })
    }
    throw createError({
      statusCode: 500,
      message: 'Terjadi kesalahan saat menghapus akun'
    })
  }
})
