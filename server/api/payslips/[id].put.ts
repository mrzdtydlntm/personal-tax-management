import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Payslip ID is required'
    })
  }

  // Build update data object, only including fields that are provided
  const updateData: any = {}

  if (body.month !== undefined) {
    updateData.month = parseInt(body.month)
  }
  if (body.year !== undefined) {
    updateData.year = parseInt(body.year)
  }
  if (body.grossSalary !== undefined) {
    updateData.grossSalary = parseFloat(body.grossSalary)
  }
  if (body.takeHomePay !== undefined) {
    updateData.takeHomePay = parseFloat(body.takeHomePay)
  }
  if (body.pph21Deducted !== undefined) {
    updateData.pph21Deducted = parseFloat(body.pph21Deducted)
  }
  if (body.otherDeductions !== undefined) {
    updateData.otherDeductions = parseFloat(body.otherDeductions)
  }
  if (body.fileUrl !== undefined) {
    updateData.fileUrl = body.fileUrl || null
  }

  const payslip = await prisma.payslip.update({
    where: { id },
    data: updateData
  })

  return payslip
})
