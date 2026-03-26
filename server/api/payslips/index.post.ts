import prisma from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { encryptNumber, decryptPayslip } from '~/server/utils/encryption'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const body = await readBody(event)
  const { month, year, grossSalary, takeHomePay, pph21Deducted, otherDeductions, fileUrl } = body

  if (!month || !year || grossSalary === undefined || takeHomePay === undefined || pph21Deducted === undefined) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: month, year, grossSalary, takeHomePay, pph21Deducted'
    })
  }

  if (month < 1 || month > 12) {
    throw createError({
      statusCode: 400,
      message: 'Month must be between 1 and 12'
    })
  }

  const existing = await prisma.payslip.findUnique({
    where: { userId_month_year: { userId, month, year } }
  })

  if (existing) {
    throw createError({
      statusCode: 409,
      message: `Payslip for ${month}/${year} already exists. Use PUT to update.`
    })
  }

  const row = await prisma.payslip.create({
    data: {
      userId,
      month,
      year,
      grossSalary: encryptNumber(parseFloat(grossSalary)),
      takeHomePay: encryptNumber(parseFloat(takeHomePay)),
      pph21Deducted: encryptNumber(parseFloat(pph21Deducted)),
      otherDeductions: encryptNumber(otherDeductions ? parseFloat(otherDeductions) : 0),
      fileUrl: fileUrl || null
    }
  })

  return decryptPayslip(row)
})
