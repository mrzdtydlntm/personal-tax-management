import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const year = query.year ? parseInt(query.year as string) : new Date().getFullYear()

  const payslips = await prisma.payslip.findMany({
    where: { year },
    orderBy: { month: 'asc' }
  })

  return payslips
})
