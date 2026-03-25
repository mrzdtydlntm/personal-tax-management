import prisma from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Payslip ID is required' })
  }

  // Ensure the payslip belongs to the authenticated user
  const existing = await prisma.payslip.findFirst({ where: { id, userId } })
  if (!existing) {
    throw createError({ statusCode: 404, message: 'Payslip not found' })
  }

  await prisma.payslip.delete({ where: { id } })

  return { success: true }
})
