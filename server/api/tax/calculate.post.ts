import prisma from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { calculateAnnualTax, calculateMonthlyProjection } from '~/server/utils/taxCalculator'
import { decryptPayslip } from '~/server/utils/encryption'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const body = await readBody(event)
  const { year, ptkpStatus } = body

  const currentYear = year || new Date().getFullYear()

  const rows = await prisma.payslip.findMany({
    where: { userId, year: currentYear },
    orderBy: { month: 'asc' }
  })

  if (rows.length === 0) {
    throw createError({ statusCode: 404, message: 'No payslips found for this year' })
  }

  const payslips = rows.map(decryptPayslip)

  const annualGrossIncome = payslips.reduce((sum, p) => sum + p.grossSalary, 0)
  const totalPph21Deducted = payslips.reduce((sum, p) => sum + p.pph21Deducted, 0)
  const totalTakeHomePay = payslips.reduce((sum, p) => sum + p.takeHomePay, 0)

  const taxCalculation = calculateAnnualTax(
    annualGrossIncome,
    ptkpStatus || 'TK/0',
    totalPph21Deducted
  )

  const latestMonth = Math.max(...payslips.map(p => p.month))
  let projection = null

  if (latestMonth < 12 && currentYear === new Date().getFullYear()) {
    projection = calculateMonthlyProjection(
      payslips.map(p => ({ grossSalary: p.grossSalary, pph21Deducted: p.pph21Deducted })),
      latestMonth
    )
  }

  return {
    year: currentYear,
    payslipsCount: payslips.length,
    totalTakeHomePay,
    ...taxCalculation,
    projection,
    monthlyBreakdown: payslips.map(p => ({
      month: p.month,
      grossSalary: p.grossSalary,
      pph21Deducted: p.pph21Deducted,
      takeHomePay: p.takeHomePay
    }))
  }
})
