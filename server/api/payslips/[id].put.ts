import prisma from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { encryptNumber, decryptPayslip } from '~/server/utils/encryption'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, message: 'Payslip ID is required' })
  }

  // Ensure the payslip belongs to the authenticated user
  const existing = await prisma.payslip.findFirst({ where: { id, userId } })
  if (!existing) {
    throw createError({ statusCode: 404, message: 'Payslip not found' })
  }

  const updateData: any = {}
  if (body.month !== undefined)           updateData.month = parseInt(body.month)
  if (body.year !== undefined)            updateData.year = parseInt(body.year)
  if (body.grossSalary !== undefined)     updateData.grossSalary = encryptNumber(parseFloat(body.grossSalary))
  if (body.takeHomePay !== undefined)     updateData.takeHomePay = encryptNumber(parseFloat(body.takeHomePay))
  if (body.pph21Deducted !== undefined)   updateData.pph21Deducted = encryptNumber(parseFloat(body.pph21Deducted))
  if (body.otherDeductions !== undefined) updateData.otherDeductions = encryptNumber(parseFloat(body.otherDeductions))
  if (body.fileUrl !== undefined)         updateData.fileUrl = body.fileUrl || null

  const row = await prisma.payslip.update({
    where: { id },
    data: updateData
  })

  return decryptPayslip(row)
})
