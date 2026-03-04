import prisma from '~/server/utils/prisma'
import { calculateAnnualTax, calculateMonthlyProjection } from '~/server/utils/taxCalculator'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { year, ptkpStatus } = body

  const currentYear = year || new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  // Get all payslips for the year
  const payslips = await prisma.payslip.findMany({
    where: { year: currentYear },
    orderBy: { month: 'asc' }
  })

  if (payslips.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'No payslips found for this year'
    })
  }

  // Calculate totals
  const annualGrossIncome = payslips.reduce((sum, p) => sum + p.grossSalary, 0)
  const totalPph21Deducted = payslips.reduce((sum, p) => sum + p.pph21Deducted, 0)
  const totalTakeHomePay = payslips.reduce((sum, p) => sum + p.takeHomePay, 0)

  // Calculate tax
  const taxCalculation = calculateAnnualTax(
    annualGrossIncome,
    ptkpStatus || 'TK/0',
    totalPph21Deducted
  )

  // Calculate projection if not all months are filled
  const latestMonth = Math.max(...payslips.map(p => p.month))
  let projection = null

  if (latestMonth < 12 && currentYear === new Date().getFullYear()) {
    projection = calculateMonthlyProjection(
      payslips.map(p => ({
        grossSalary: p.grossSalary,
        pph21Deducted: p.pph21Deducted
      })),
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
