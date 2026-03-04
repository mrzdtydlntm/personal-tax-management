import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { month, year, grossSalary, takeHomePay, pph21Deducted, otherDeductions, fileUrl } = body

  // Validate required fields
  if (!month || !year || grossSalary === undefined || takeHomePay === undefined || pph21Deducted === undefined) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: month, year, grossSalary, takeHomePay, pph21Deducted'
    })
  }

  // Validate month range
  if (month < 1 || month > 12) {
    throw createError({
      statusCode: 400,
      message: 'Month must be between 1 and 12'
    })
  }

  // Check if payslip already exists
  const existing = await prisma.payslip.findUnique({
    where: {
      month_year: { month, year }
    }
  })

  if (existing) {
    throw createError({
      statusCode: 409,
      message: `Payslip for ${month}/${year} already exists. Use PUT to update.`
    })
  }

  const payslip = await prisma.payslip.create({
    data: {
      month,
      year,
      grossSalary: parseFloat(grossSalary),
      takeHomePay: parseFloat(takeHomePay),
      pph21Deducted: parseFloat(pph21Deducted),
      otherDeductions: otherDeductions ? parseFloat(otherDeductions) : 0,
      fileUrl: fileUrl || null
    }
  })

  return payslip
})
