import prisma from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { decryptPayslip } from '~/server/utils/encryption'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const query = getQuery(event)
  const year = query.year ? parseInt(query.year as string) : new Date().getFullYear()

  const rows = await prisma.payslip.findMany({
    where: { userId, year },
    orderBy: { month: 'asc' }
  })

  return rows.map(decryptPayslip)
})
